package de.mpg.mpi.inf.d5.yavi.server.providers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.persistence.EntityManager;
import javax.persistence.Query;

import com.google.common.base.Joiner;
import com.google.common.collect.ImmutableMap;

public class NeighbourhoodProvider {
  
  static ImmutableMap<String, String> WIKIPEDIA_TABLE_BY_ID =
      new ImmutableMap.Builder<String, String>()
        .put("en", "enwiki20160113")
        .put("de", "dewiki20160111")
        .put("ja", "jawiki20160111")
        .put("ru", "ruwiki20160111")
        .put("es", "eswiki20160111")
        .put("fr", "frwiki20160111")
        .put("it", "itwiki20160111")
        .put("pt", "ptwiki20160111")
        .put("zh", "zhwiki20160111")
        .put("pl", "plwiki20160111")
        .build();
  
  public static Set<Integer> getPageNeighbourhood(int pageId,
                                                  String wikipediaId,
                                                  int dayFrom,
                                                  int dayTo) {
    EntityManager manager = ProviderUtil.getEntityManagerByWikipediaId(wikipediaId);
    String table = WIKIPEDIA_TABLE_BY_ID.get(wikipediaId);
    String queryStatement = Joiner.on("\n").join(
        "select outlink from ",
        "(select page_id, outlink, max(day_number) from " + table + ".added_outlinks ao",
        "where ao.day_number <= " + dayTo,
        "and page_id in (" + pageId + ")",
        "group by page_id, outlink) as at",
        "left join",
        "(select page_id, outlink, max(day_number) from enwiki20160113.removed_outlinks ro",
        "where ro.day_number < " + dayFrom,
        "and page_id in (" + pageId + ")",
        "group by page_id, outlink) as rt using (page_id, outlink)",
        "where at.max > rt.max or rt.max is NULL"
    );
    Query query = manager.createNativeQuery(queryStatement);
    @SuppressWarnings("unchecked")
    List<Integer> queryResultList = (List<Integer>) query.getResultList();
    Set<Integer> neighbourhood = new HashSet<>();
    for (int neighbourPageId : queryResultList) {
      neighbourhood.add(neighbourPageId);      
    }
    neighbourhood.remove(pageId);
    return neighbourhood;
  }
  
  public static Map<Integer, Set<Integer>> getPagesNeighbourhoods(Set<Integer> pageIds,
                                                                  String wikipediaId,
                                                                  int dayFrom,
                                                                  int dayTo) {
    if (pageIds.isEmpty()) {
      return new HashMap<>();
    }
    EntityManager manager = ProviderUtil.getEntityManagerByWikipediaId(wikipediaId);
    String table = WIKIPEDIA_TABLE_BY_ID.get(wikipediaId);
    List<String> stringPageIds = new ArrayList<>();
    for (int pageId : pageIds) {
      stringPageIds.add(Integer.toString(pageId));
    }
    String pageIdsList = Joiner.on(",").join(stringPageIds);
    String queryStatement = Joiner.on("\n").join(
        "select page_id, outlink from ",
        "(select page_id, outlink, max(day_number) from " + table + ".added_outlinks ao",
        "where ao.day_number <= " + dayTo,
        "and page_id in (" + pageIdsList + ")",
        "group by page_id, outlink) as at",
        "left join",
        "(select page_id, outlink, max(day_number) from " + table + ".removed_outlinks ro",
        "where ro.day_number < " + dayFrom,
        "and page_id in (" + pageIdsList + ")",
        "group by page_id, outlink) as rt using (page_id, outlink)",
        "where at.max > rt.max or rt.max is NULL"
    );
    Query query = manager.createNativeQuery(queryStatement);
    @SuppressWarnings("unchecked")
    List<Object[]> queryResultList = query.getResultList();
    Map<Integer, Set<Integer>> pagesNeighbourhoods = new HashMap<>();
    for (int pageId : pageIds) {
      pagesNeighbourhoods.put(pageId, new HashSet<Integer>());
    }
    for (Object[] row : queryResultList) {
      int pageId = (int) row[0];
      int outlink = (int) row[1];
      pagesNeighbourhoods.get(pageId).add(outlink);
    }
    return pagesNeighbourhoods;
  }
}
