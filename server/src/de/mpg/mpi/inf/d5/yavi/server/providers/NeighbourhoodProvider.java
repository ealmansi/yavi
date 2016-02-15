package de.mpg.mpi.inf.d5.yavi.server.providers;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.persistence.EntityManager;
import javax.persistence.Query;

import com.google.common.base.Joiner;

import de.mpg.mpi.inf.d5.yavi.server.entities.AddedOutlink;

public class NeighbourhoodProvider {
  public Set<Integer> getPageNeighbourhood(int pageId, String wikipediaId, int dayFrom, int dayTo) {
    List<AddedOutlink> entries = ProviderUtil.getPageEntriesTillDay("AddedOutlink",
                                                                              pageId,
                                                                              wikipediaId,
                                                                              dayTo);
    Set<Integer> neighbourhood = new HashSet<>();
    for (AddedOutlink entry : entries) {
      neighbourhood.add(entry.getId().getOutlink());
    }
    neighbourhood.remove(pageId);
    return neighbourhood;
  }
  
  public Map<Integer, Set<Integer>> getPageNeighbourhoods(Set<Integer> pageIds, String wikipediaId, int dayFrom, int dayTo) {
    EntityManager entityManager = ProviderUtil.getEntityManagerByWikipediaId(wikipediaId);
    String queryStatement = Joiner.on("\n").join(
        "SELECT e",
        "FROM AddedOutlink e",
        "WHERE",
          "e.id.pageId IN :pageIds AND",
          "e.id.dayNumber >= :dayFrom AND",
          "e.id.dayNumber <= :dayTo"
    );
    Query query = entityManager.createQuery(queryStatement);
    query.setParameter("pageIds", pageIds);
    query.setParameter("dayFrom", dayFrom);
    query.setParameter("dayTo", dayTo);
    Map<Integer, Set<Integer>> neighbourhoods = new HashMap<>();
    for (Integer pageId : pageIds) {
      neighbourhoods.put(pageId, new HashSet<Integer>());
    }
    for (Object entryObject : query.getResultList()) {
      AddedOutlink entry = (AddedOutlink) entryObject;
      int entryPageId = entry.getId().getPageId();
      int entryOutlink = entry.getId().getOutlink();
      neighbourhoods.get(entryPageId).add(entryOutlink);
    }
    return neighbourhoods;
  }
}
