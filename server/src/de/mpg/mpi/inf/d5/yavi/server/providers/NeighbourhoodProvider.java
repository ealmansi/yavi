package de.mpg.mpi.inf.d5.yavi.server.providers;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import de.mpg.mpi.inf.d5.yavi.server.entities.AddedOutlink;
import de.mpg.mpi.inf.d5.yavi.server.entities.RemovedOutlink;

public class NeighbourhoodProvider {
  public static Set<Integer> getPageNeighbourhood(int pageId, String wikipediaId, int dayFrom, int dayTo) {
    List<AddedOutlink> addedOutlinks = ProviderUtil.getPageEntriesTillDay("AddedOutlink",
                                                                              pageId,
                                                                              wikipediaId,
                                                                              dayTo);
    List<RemovedOutlink> removedOutlinks = ProviderUtil.getPageEntriesTillDay("RemovedOutlink",
                                                                              pageId,
                                                                              wikipediaId,
                                                                              dayTo);
    Set<Integer> neighbourhood = reconstructNeighbourhood(pageId, dayFrom, addedOutlinks, removedOutlinks);
    return neighbourhood;
  }
  
  public static Map<Integer, Set<Integer>> getPagesNeighbourhoods(Set<Integer> pageIds, String wikipediaId, int dayFrom, int dayTo) {
    List<AddedOutlink> addedOutlinks = ProviderUtil.getPagesEntriesTillDay("AddedOutlink",
                                                                              pageIds,
                                                                              wikipediaId,
                                                                              dayTo);
    List<RemovedOutlink> removedOutlinks = ProviderUtil.getPagesEntriesTillDay("RemovedOutlink",
                                                                              pageIds,
                                                                              wikipediaId,
                                                                              dayTo);
    Map<Integer, List<AddedOutlink>> indexedAddedOutlinks =
        indexAddedOutlinks(pageIds, addedOutlinks);
    Map<Integer, List<RemovedOutlink>> indexedRemovedOutlinks =
        indexRemovedOutlinks(pageIds, removedOutlinks);
    Map<Integer, Set<Integer>> pagesNeighbourhoods = new HashMap<>();
    for (int pageId : pageIds) {
      List<AddedOutlink> pageAddedOutlinks = indexedAddedOutlinks.get(pageId);
      List<RemovedOutlink> pageRemovedOutlinks = indexedRemovedOutlinks.get(pageId);
      Set<Integer> neighbourhood =
          reconstructNeighbourhood(pageId, dayFrom, pageAddedOutlinks, pageRemovedOutlinks);
      pagesNeighbourhoods.put(pageId, neighbourhood);
    }
    return pagesNeighbourhoods;
  }

  private static Map<Integer, List<AddedOutlink>> indexAddedOutlinks(Set<Integer> pageIds, List<AddedOutlink> addedOutlinks) {
    Map<Integer, List<AddedOutlink>> indexedAddedOutlinks = new HashMap<>();
    for (int pageId : pageIds) {
      indexedAddedOutlinks.put(pageId, new ArrayList<AddedOutlink>());
    }
    for (AddedOutlink addedOutlink : addedOutlinks) {
      int pageId = addedOutlink.getId().getPageId();
      indexedAddedOutlinks.get(pageId).add(addedOutlink);
    }
    return indexedAddedOutlinks;
  }
  
  private static Map<Integer, List<RemovedOutlink>> indexRemovedOutlinks(Set<Integer> pageIds, List<RemovedOutlink> removedOutlinks) {
    Map<Integer, List<RemovedOutlink>> indexedRemovedOutlinks = new HashMap<>();
    for (int pageId : pageIds) {
      indexedRemovedOutlinks.put(pageId, new ArrayList<RemovedOutlink>());
    }
    for (RemovedOutlink removedOutlink : removedOutlinks) {
      int pageId = removedOutlink.getId().getPageId();
      indexedRemovedOutlinks.get(pageId).add(removedOutlink);
    }
    return indexedRemovedOutlinks;
  }

  private static Set<Integer> reconstructNeighbourhood(int pageId, int dayFrom, List<AddedOutlink> addedOutlinks,
      List<RemovedOutlink> removedOutlinks) {
    List<NeighbourhoodAction> neighbourhoodActions = new ArrayList<>();
    for (AddedOutlink addedOutlink : addedOutlinks) {
      int dayNumber = addedOutlink.getId().getDayNumber();
      int outlink = addedOutlink.getId().getOutlink();
      neighbourhoodActions.add(new NeighbourhoodAction(dayNumber, outlink, NeighbourhoodAction.Action.ADD));
    }
    for (RemovedOutlink removedOutlink : removedOutlinks) {
      int dayNumber = removedOutlink.getId().getDayNumber();
      int outlink = removedOutlink.getId().getOutlink();
      neighbourhoodActions.add(new NeighbourhoodAction(dayNumber, outlink, NeighbourhoodAction.Action.REMOVE));
    }
    Collections.sort(neighbourhoodActions);
    Set<Integer> neighbourhood = new HashSet<>();
    for (NeighbourhoodAction neighbourhoodAction : neighbourhoodActions) {
      int dayNumber = neighbourhoodAction.dayNumber;
      int outlink = neighbourhoodAction.outlink;
      switch(neighbourhoodAction.action) {
      case ADD:
        neighbourhood.add(outlink);
        break;
      default: // case REMOVE:
        if (dayNumber < dayFrom) {
          neighbourhood.remove(outlink);
        }
        break;
      }
    }
    neighbourhood.remove(pageId);
    return neighbourhood;
  }
  
  private static class NeighbourhoodAction implements Comparable<NeighbourhoodAction> {
    enum Action {ADD, REMOVE}
    
    public NeighbourhoodAction(int dayNumber, int outlink, Action action) {
      this.dayNumber = dayNumber;
      this.outlink = outlink;
      this.action = action;
    }

    public int dayNumber;
    public int outlink;
    public Action action;

    @Override
    public int compareTo(NeighbourhoodAction other) {
      if (this.dayNumber != other.dayNumber) {
        return Integer.compare(this.dayNumber, other.dayNumber); 
      }
      if (this.outlink != other.outlink) {
        return Integer.compare(this.outlink, other.outlink); 
      }
      return this.action.compareTo(other.action);
    };
  }
}
