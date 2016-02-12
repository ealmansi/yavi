package de.mpg.mpi.inf.d5.yavi.server;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import de.mpg.mpi.inf.d5.yavi.server.providers.NeighbourhoodProvider;
import de.mpg.mpi.inf.d5.yavi.server.util.PageIdScore;

public class RelatedPages {
  NeighbourhoodProvider neighbourhoodProvider = new NeighbourhoodProvider();
  
  public List<PageIdScore> getTopRelatedPages(long pageId, String wikipediaId, int dayFrom, int dayTo) {
    Set<Long> pageNeighbourhood = neighbourhoodProvider.getPageNeighbourhood(pageId, wikipediaId, dayFrom, dayTo);
    Map<Long, Set<Long>> neighbourNeighbourhoods =
        neighbourhoodProvider.getPageNeighbourhoods(pageNeighbourhood, wikipediaId, dayFrom, dayTo);
    Map<Long, Double> neighbourScores = new HashMap<>();
    for (Map.Entry<Long, Set<Long>> entry : neighbourNeighbourhoods.entrySet()) {
      Long entryPageId = entry.getKey();
      Set<Long> entryNeighbourhood = entry.getValue();
      Double score = computeJaccardIndex(pageNeighbourhood, entryNeighbourhood);
      neighbourScores.put(entryPageId, score);
    }
    List<PageIdScore> topRelatedPages = selectTopRelatedPages(neighbourScores);
    return topRelatedPages;
  }

  private List<PageIdScore> selectTopRelatedPages(Map<Long, Double> neighbourScores) {
    List<Map.Entry<Long, Double>> entries = new ArrayList<>(neighbourScores.entrySet());
    Collections.sort(entries, new Comparator<Map.Entry<Long, Double>>() {
      @Override
      public int compare(Map.Entry<Long, Double> a, Map.Entry<Long, Double> b) {
        int valueCompareTo = b.getValue().compareTo(a.getValue());
        if (valueCompareTo != 0) {
          return valueCompareTo;
        }
        int keyCompareTo = b.getKey().compareTo(a.getKey());
        return keyCompareTo;
      }
    });
    List<PageIdScore> topRelatedPages = new ArrayList<>();
    for (Map.Entry<Long, Double> entry :
        entries.subList(0, Math.min(entries.size(), 10))) {
      topRelatedPages.add(new PageIdScore(entry.getKey(), entry.getValue()));
    }
    return topRelatedPages;
  }

  private Double computeJaccardIndex(Set<Long> pageNeighbourhood,
      Set<Long> neighbourNeighbourhood) {
    Set<Long> union = new HashSet<Long>(pageNeighbourhood);
    union.addAll(neighbourNeighbourhood);
    Set<Long> intersection = new HashSet<Long>(pageNeighbourhood);
    intersection.retainAll(neighbourNeighbourhood);
    if (union.isEmpty()) {
      return 0.0;
    }
    return 1.0 * intersection.size() / union.size();
  }
}
