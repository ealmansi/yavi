package de.mpg.mpi.inf.d5.yavi.server;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import de.mpg.mpi.inf.d5.yavi.server.providers.NeighbourhoodProvider;
import de.mpg.mpi.inf.d5.yavi.server.util.PageIdScore;

public class RelatedPages {
  private static final Comparator<Entry<Integer, Double>> MAP_ENTRY_VALUE_COMPARATOR_DESC =
      Collections.reverseOrder(new MapEntryValueComparator());

  private static final int NEIGHBOURS_LIMIT = 50;
  private static final int RELATED_PAGES_LIMIT = 10;

  private NeighbourhoodProvider neighbourhoodProvider = new NeighbourhoodProvider();
  
  public List<PageIdScore> getTopRelatedPages(int pageId,
                                              String wikipediaId,
                                              int dayFrom, int dayTo) {
    Set<Integer> relatedPages = getRelatedPages(pageId, wikipediaId, dayFrom, dayTo);
    Map<Integer, Double> relatedPageScores =
        scoreRelatedPages(relatedPages, wikipediaId, dayFrom, dayTo);
    return selectTopRelatedPages(relatedPageScores);
  }

  private Set<Integer> getRelatedPages(int pageId,
                                    String wikipediaId,
                                    int dayFrom, int dayTo) {
    Set<Integer> pageNeighbourhood =
        neighbourhoodProvider.getPageNeighbourhood(pageId, wikipediaId, dayFrom, dayTo);
    Map<Integer, Set<Integer>> neighbourNeighbourhoods =
        neighbourhoodProvider.getPageNeighbourhoods(pageNeighbourhood, wikipediaId, dayFrom, dayTo);
    Map<Integer, Double> neighbourScores = scoreNeighbours(pageNeighbourhood, neighbourNeighbourhoods);
    return selectTopNeighbours(neighbourScores);
  }

  private Map<Integer, Double> scoreRelatedPages(Set<Integer> relatedPages, String wikipediaId, int dayFrom, int dayTo) {
    Map<Integer, Double> relatedPageScores = new HashMap<>();
    for (Integer relatedPageId : relatedPages) {
      relatedPageScores.put(relatedPageId, 1.0);
    }
    return relatedPageScores;
  }

  private List<PageIdScore> selectTopRelatedPages(Map<Integer, Double> relatedPageScores) {
    List<Entry<Integer, Double>> topRelatedPageScoreEntries =
        getTopEntries(relatedPageScores, MAP_ENTRY_VALUE_COMPARATOR_DESC, RELATED_PAGES_LIMIT);
    List<PageIdScore> pageIdScoresList = new ArrayList<>();
    for (Entry<Integer, Double> topRelatedPageScoreEntry : topRelatedPageScoreEntries) {
      PageIdScore pageIdScore = new PageIdScore(topRelatedPageScoreEntry.getKey(),
          topRelatedPageScoreEntry.getValue());
      pageIdScoresList.add(pageIdScore);
    }
    return pageIdScoresList;
  }

  private Map<Integer, Double> scoreNeighbours(Set<Integer> pageNeighbourhood, Map<Integer, Set<Integer>> neighbourNeighbourhoods) {
    Map<Integer, Double> neighbourScores = new HashMap<>();
    for (Integer neighbourPageId : pageNeighbourhood) {
      double jaccardIndex = computeJaccardIndex(pageNeighbourhood,
                                                neighbourNeighbourhoods.get(neighbourPageId));
      neighbourScores.put(neighbourPageId, jaccardIndex);
    }
    return neighbourScores;
  }

  private Double computeJaccardIndex(Set<Integer> pageNeighbourhood,
      Set<Integer> neighbourNeighbourhood) {
    Set<Integer> union = new HashSet<Integer>(pageNeighbourhood);
    union.addAll(neighbourNeighbourhood);
    Set<Integer> intersection = new HashSet<Integer>(pageNeighbourhood);
    intersection.retainAll(neighbourNeighbourhood);
    if (union.isEmpty()) {
      return 0.0;
    }
    return 1.0 * intersection.size() / union.size();
  }

  private Set<Integer> selectTopNeighbours(Map<Integer, Double> neighbourScores) {
    List<Entry<Integer, Double>> topNeighbourScoreEntries =
        getTopEntries(neighbourScores, MAP_ENTRY_VALUE_COMPARATOR_DESC, NEIGHBOURS_LIMIT);
    Set<Integer> topNeighbours = new HashSet<>();
    for (Entry<Integer, Double> topNeighbourScoreEntry : topNeighbourScoreEntries) {
      topNeighbours.add(topNeighbourScoreEntry.getKey());
    }
    return topNeighbours;
  }

  private <K, V> List<Entry<K, V>> getTopEntries(Map<K, V> map, Comparator<Entry<K, V>> comparator, int limit) {
    List<Entry<K, V>> entries = new ArrayList<>(map.entrySet());
    Collections.sort(entries, comparator);
    List<Entry<K, V>> topEntries = entries.subList(0, Math.min(entries.size(), limit));
    return topEntries;
  }
  
  private static class MapEntryValueComparator implements Comparator<Entry<Integer, Double>> {
    @Override
    public int compare(Entry<Integer, Double> entry, Entry<Integer, Double> otherEntry) {
      int valueCompare = entry.getValue().compareTo(otherEntry.getValue());
      if (valueCompare != 0) {
        return valueCompare;
      }
      return entry.getKey().compareTo(entry.getKey());
    }
  }
}
