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

import de.mpg.mpi.inf.d5.yavi.server.beans.PageActivityFeaturesVector;
import de.mpg.mpi.inf.d5.yavi.server.beans.PageIdScorePair;
import de.mpg.mpi.inf.d5.yavi.server.providers.NeighbourhoodProvider;

public class RelatedPages {
  private static final int NEIGHBOURS_LIMIT = 50;
  private static final int RELATED_PAGES_LIMIT = 10;
  
  private static final Comparator<Entry<Integer, Double>> MAP_ENTRY_VALUE_COMPARATOR_DESC =
      Collections.reverseOrder(new MapEntryValueComparator());

  public static List<PageIdScorePair> getRelatedPagesRanking(int pageId,
                                                              String wikipediaId,
                                                              int dayFrom,
                                                              int dayTo) {
    Set<Integer> relatedPages = getRelatedPages(pageId, wikipediaId, dayFrom, dayTo);
    Map<Integer, Double> relatedPageScores =
        scoreRelatedPages(relatedPages, wikipediaId, dayFrom, dayTo);
    return selectTopRelatedPages(relatedPageScores);
  }

  public static Set<Integer> getRelatedPages(int pageId,
                                String wikipediaId,
                                int dayFrom,
                                int dayTo) {
    Set<Integer> pageNeighbourhood =
        NeighbourhoodProvider.getPageNeighbourhood(pageId, wikipediaId, dayFrom, dayTo);
    Map<Integer, Set<Integer>> neighbourNeighbourhoods =
        NeighbourhoodProvider.getPagesNeighbourhoods(pageNeighbourhood, wikipediaId, dayFrom, dayTo);
    Map<Integer, Double> neighbourScores = scoreNeighbours(pageNeighbourhood, neighbourNeighbourhoods);
    return selectTopNeighbours(neighbourScores);
  }

  private static Map<Integer, Double> scoreRelatedPages(Set<Integer> relatedPages,
                                                  String wikipediaId,
                                                  int dayFrom,
                                                  int dayTo) {
    Map<Integer, PageActivityFeaturesVector> pageActivityFeaturesVectors =
        PageActivityFeatures.getPagesActivityFeaturesVectors(relatedPages, wikipediaId,
                                                            dayFrom, dayTo);
    Map<Integer, Double> relatedPageScores = new HashMap<>();
    for (int relatedPageId : relatedPages) {
      PageActivityFeaturesVector pageActivityFeaturesVector =
          pageActivityFeaturesVectors.get(relatedPageId);
      double score = PageActivityFeatures.computePageFeaturesVectorScore(pageActivityFeaturesVector);
      relatedPageScores.put(relatedPageId, score);
    }
    return relatedPageScores;
  }

  private static List<PageIdScorePair> selectTopRelatedPages(Map<Integer, Double> relatedPageScores) {
    List<Entry<Integer, Double>> topRelatedPageScoreEntries =
        getTopEntries(relatedPageScores, MAP_ENTRY_VALUE_COMPARATOR_DESC, RELATED_PAGES_LIMIT);
    List<PageIdScorePair> pageIdScoresList = new ArrayList<>();
    for (Entry<Integer, Double> topRelatedPageScoreEntry : topRelatedPageScoreEntries) {
      PageIdScorePair pageIdScore = new PageIdScorePair(topRelatedPageScoreEntry.getKey(),
          topRelatedPageScoreEntry.getValue());
      pageIdScoresList.add(pageIdScore);
    }
    return pageIdScoresList;
  }

  private static Map<Integer, Double> scoreNeighbours(Set<Integer> pageNeighbourhood,
                                                Map<Integer, Set<Integer>> neighbourNeighbourhoods) {
    Map<Integer, Double> neighbourScores = new HashMap<>();
    for (Integer neighbourPageId : pageNeighbourhood) {
      double jaccardIndex =
          computeJaccardIndex(pageNeighbourhood, neighbourNeighbourhoods.get(neighbourPageId));
      neighbourScores.put(neighbourPageId, jaccardIndex);
    }
    return neighbourScores;
  }

  private static Set<Integer> selectTopNeighbours(Map<Integer, Double> neighbourScores) {
    List<Entry<Integer, Double>> topNeighbourScoreEntries =
        getTopEntries(neighbourScores, MAP_ENTRY_VALUE_COMPARATOR_DESC, NEIGHBOURS_LIMIT);
    Set<Integer> topNeighbours = new HashSet<>();
    for (Entry<Integer, Double> topNeighbourScoreEntry : topNeighbourScoreEntries) {
      topNeighbours.add(topNeighbourScoreEntry.getKey());
    }
    return topNeighbours;
  }

  private static Double computeJaccardIndex(Set<Integer> pageNeighbourhood,
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

  private static <K, V> List<Entry<K, V>> getTopEntries(Map<K, V> map, Comparator<Entry<K, V>> comparator, int limit) {
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
