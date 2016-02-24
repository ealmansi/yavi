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

public class NeighbourhoodProvider {
  
  public static Set<Integer> getPageNeighbourhood(int pageId,
                                                  String wikipediaId,
                                                  int dayFrom,
                                                  int dayTo) {
    EntityManager manager = ProviderUtil.getEntityManagerByWikipediaId(wikipediaId);
    String queryStatement = Joiner.on("\n").join(
        "select outlink from ",
        "(select page_id, outlink, max(day_number) from enwiki20160113.added_outlinks ao",
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
    List<String> stringPageIds = new ArrayList<>();
    for (int pageId : pageIds) {
      stringPageIds.add(Integer.toString(pageId));
    }
    String pageIdsList = Joiner.on(",").join(stringPageIds);
    String queryStatement = Joiner.on("\n").join(
        "select page_id, outlink from ",
        "(select page_id, outlink, max(day_number) from enwiki20160113.added_outlinks ao",
        "where ao.day_number <= " + dayTo,
        "and page_id in (" + pageIdsList + ")",
        "group by page_id, outlink) as at",
        "left join",
        "(select page_id, outlink, max(day_number) from enwiki20160113.removed_outlinks ro",
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

  // public static Set<Integer> getPageNeighbourhood(int pageId,
  //                                                 String wikipediaId,
  //                                                 int dayFrom,
  //                                                 int dayTo) {
  //  List<AddedOutlink> addedOutlinks =
  //      ProviderUtil.getPageEntriesTillDay("AddedOutlink", pageId, wikipediaId, dayTo);
  //  List<RemovedOutlink> removedOutlinks =
  //      ProviderUtil.getPageEntriesTillDay("RemovedOutlink", pageId, wikipediaId, dayTo);
  //  Set<Integer> neighbourhood = reconstructNeighbourhood(pageId, dayFrom, addedOutlinks, removedOutlinks);
  //  return neighbourhood;
  // }
  
  // public static Map<Integer, Set<Integer>> getPagesNeighbourhoods(Set<Integer> pageIds,
  //                                                                 String wikipediaId,
  //                                                                 int dayFrom,
  //                                                                 int dayTo) {
  //   List<AddedOutlink> addedOutlinks = ProviderUtil.getPagesEntriesTillDay("AddedOutlink",
  //                                                                             pageIds,
  //                                                                             wikipediaId,
  //                                                                             dayTo);
  //   List<RemovedOutlink> removedOutlinks = ProviderUtil.getPagesEntriesTillDay("RemovedOutlink",
  //                                                                             pageIds,
  //                                                                             wikipediaId,
  //                                                                             dayTo);
  //   Map<Integer, List<AddedOutlink>> indexedAddedOutlinks =
  //       indexAddedOutlinks(pageIds, addedOutlinks);
  //   Map<Integer, List<RemovedOutlink>> indexedRemovedOutlinks =
  //       indexRemovedOutlinks(pageIds, removedOutlinks);
  //   Map<Integer, Set<Integer>> pagesNeighbourhoods = new HashMap<>();
  //   for (int pageId : pageIds) {
  //     List<AddedOutlink> pageAddedOutlinks = indexedAddedOutlinks.get(pageId);
  //     List<RemovedOutlink> pageRemovedOutlinks = indexedRemovedOutlinks.get(pageId);
  //     Set<Integer> neighbourhood =
  //         reconstructNeighbourhood(pageId, dayFrom, pageAddedOutlinks, pageRemovedOutlinks);
  //     pagesNeighbourhoods.put(pageId, neighbourhood);
  //   }
  //   return pagesNeighbourhoods;
  // }

  // private static Map<Integer, List<AddedOutlink>> indexAddedOutlinks(Set<Integer> pageIds, List<AddedOutlink> addedOutlinks) {
  //   Map<Integer, List<AddedOutlink>> indexedAddedOutlinks = new HashMap<>();
  //   for (int pageId : pageIds) {
  //     indexedAddedOutlinks.put(pageId, new ArrayList<AddedOutlink>());
  //   }
  //   for (AddedOutlink addedOutlink : addedOutlinks) {
  //     int pageId = addedOutlink.getId().getPageId();
  //     indexedAddedOutlinks.get(pageId).add(addedOutlink);
  //   }
  //   return indexedAddedOutlinks;
  // }
  
  // private static Map<Integer, List<RemovedOutlink>> indexRemovedOutlinks(Set<Integer> pageIds, List<RemovedOutlink> removedOutlinks) {
  //   Map<Integer, List<RemovedOutlink>> indexedRemovedOutlinks = new HashMap<>();
  //   for (int pageId : pageIds) {
  //     indexedRemovedOutlinks.put(pageId, new ArrayList<RemovedOutlink>());
  //   }
  //   for (RemovedOutlink removedOutlink : removedOutlinks) {
  //     int pageId = removedOutlink.getId().getPageId();
  //     indexedRemovedOutlinks.get(pageId).add(removedOutlink);
  //   }
  //   return indexedRemovedOutlinks;
  // }

  // private static Set<Integer> reconstructNeighbourhood(int pageId, int dayFrom, List<AddedOutlink> addedOutlinks,
  //     List<RemovedOutlink> removedOutlinks) {
  //   List<NeighbourhoodAction> neighbourhoodActions = new ArrayList<>();
  //   for (AddedOutlink addedOutlink : addedOutlinks) {
  //     int dayNumber = addedOutlink.getId().getDayNumber();
  //     int outlink = addedOutlink.getId().getOutlink();
  //     neighbourhoodActions.add(new NeighbourhoodAction(dayNumber, outlink, NeighbourhoodAction.Action.ADD));
  //   }
  //   for (RemovedOutlink removedOutlink : removedOutlinks) {
  //     int dayNumber = removedOutlink.getId().getDayNumber();
  //     int outlink = removedOutlink.getId().getOutlink();
  //     neighbourhoodActions.add(new NeighbourhoodAction(dayNumber, outlink, NeighbourhoodAction.Action.REMOVE));
  //   }
  //   Collections.sort(neighbourhoodActions);
  //   Set<Integer> neighbourhood = new HashSet<>();
  //   for (NeighbourhoodAction neighbourhoodAction : neighbourhoodActions) {
  //     int dayNumber = neighbourhoodAction.dayNumber;
  //     int outlink = neighbourhoodAction.outlink;
  //     switch(neighbourhoodAction.action) {
  //     case ADD:
  //       neighbourhood.add(outlink);
  //       break;
  //     default: // case REMOVE:
  //       if (dayNumber < dayFrom) {
  //         neighbourhood.remove(outlink);
  //       }
  //       break;
  //     }
  //   }
  //   neighbourhood.remove(pageId);
  //   return neighbourhood;
  // }
  
  // private static class NeighbourhoodAction implements Comparable<NeighbourhoodAction> {
  //   enum Action {ADD, REMOVE}
    
  //   public NeighbourhoodAction(int dayNumber, int outlink, Action action) {
  //     this.dayNumber = dayNumber;
  //     this.outlink = outlink;
  //     this.action = action;
  //   }

  //   public int dayNumber;
  //   public int outlink;
  //   public Action action;

  //   @Override
  //   public int compareTo(NeighbourhoodAction other) {
  //     if (this.dayNumber != other.dayNumber) {
  //       return Integer.compare(this.dayNumber, other.dayNumber); 
  //     }
  //     if (this.outlink != other.outlink) {
  //       return Integer.compare(this.outlink, other.outlink); 
  //     }
  //     return this.action.compareTo(other.action);
  //   };
  // }
}
