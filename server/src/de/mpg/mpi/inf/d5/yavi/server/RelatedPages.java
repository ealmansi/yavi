package de.mpg.mpi.inf.d5.yavi.server;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import de.mpg.mpi.inf.d5.yavi.server.beans.DayNumberValuePair;
import de.mpg.mpi.inf.d5.yavi.server.beans.PageActivityFeaturesVector;
import de.mpg.mpi.inf.d5.yavi.server.beans.PageIdScorePair;
import de.mpg.mpi.inf.d5.yavi.server.providers.NeighbourhoodProvider;
import de.mpg.mpi.inf.d5.yavi.server.providers.SignalProvider;
import de.mpg.mpi.inf.d5.yavi.server.util.MapUtil;

public class RelatedPages {
  private static final int NEIGHBOURS_LIMIT = 50;
  private static final int RELATED_PAGES_LIMIT = 10;
  
  public static List<PageIdScorePair> getRelatedPagesRanking(int pageId,
                                                              String wikipediaId,
                                                              int dayFrom,
                                                              int dayTo) {
    System.out.println("A" + new SimpleDateFormat("HH:mm:ss").format(new Date()));
    Set<Integer> relatedPages = getRelatedPages(pageId, wikipediaId, dayFrom, dayTo);
    System.out.println("B" + new SimpleDateFormat("HH:mm:ss").format(new Date()));
    Map<Integer, Double> relatedPageScores =
        scoreRelatedPages(relatedPages, wikipediaId, dayFrom, dayTo);
    System.out.println("C" + new SimpleDateFormat("HH:mm:ss").format(new Date()));
    List<PageIdScorePair> relatedPagesRanking = selectTopRelatedPages(relatedPageScores);
    System.out.println("D" + new SimpleDateFormat("HH:mm:ss").format(new Date()));
    return relatedPagesRanking;
  }

  public static Set<Integer> getRelatedPages(int pageId,
                                String wikipediaId,
                                int dayFrom,
                                int dayTo) {
    System.out.println("AA" + new SimpleDateFormat("HH:mm:ss").format(new Date()));
    Set<Integer> pageNeighbourhood =
        NeighbourhoodProvider.getPageNeighbourhood(pageId, wikipediaId, dayFrom, dayTo);
    System.out.println("AB" + new SimpleDateFormat("HH:mm:ss").format(new Date()));
    Set<Integer> pageNeighbourhoodSubset =
        filterNeighbourhoodByNumberOfRevisions(pageNeighbourhood, wikipediaId, dayFrom, dayTo);
    System.out.println("AC" + new SimpleDateFormat("HH:mm:ss").format(new Date()));
    Map<Integer, Set<Integer>> neighbourNeighbourhoods =
        NeighbourhoodProvider.getPagesNeighbourhoods(pageNeighbourhoodSubset, wikipediaId, dayFrom, dayTo);
    System.out.println("AD" + new SimpleDateFormat("HH:mm:ss").format(new Date()));
    Map<Integer, Double> neighbourScores = scoreNeighbours(pageNeighbourhoodSubset, neighbourNeighbourhoods);
    System.out.println("AE" + new SimpleDateFormat("HH:mm:ss").format(new Date()));
    Set<Integer> topNeighbours = selectTopNeighbours(neighbourScores);
    System.out.println("AF" + new SimpleDateFormat("HH:mm:ss").format(new Date()));
    return topNeighbours;
  }

  private static Set<Integer> filterNeighbourhoodByNumberOfRevisions(Set<Integer> neighbourhood,
                                                                      String wikipediaId,
                                                                      int dayFrom,
                                                                      int dayTo) {
    Map<Integer, List<DayNumberValuePair>> indexedNumberOfRevisionsLists =
        SignalProvider.getNumberOfRevisions(neighbourhood, wikipediaId, dayFrom, dayTo);
    Map<Integer, Double> indexedTotalNumberOfRevisions = new HashMap<>();
    for (int pageId : neighbourhood) {
      List<DayNumberValuePair> numberOfRevisionsList = indexedNumberOfRevisionsLists.get(pageId);
      double totalNumberOfRevisions = PageActivitySignalUtil.computeSumOfValues(numberOfRevisionsList);
      indexedTotalNumberOfRevisions.put(pageId, totalNumberOfRevisions);
    }
    return selectTopHalfNeighbours(indexedTotalNumberOfRevisions);
  }

  private static Set<Integer> selectTopHalfNeighbours(Map<Integer, Double> indexedTotalNumberOfRevisions) {
    List<Entry<Integer, Double>> topTotalNumberOfRevisionsEntries =
        MapUtil.getTopHalfEntries(indexedTotalNumberOfRevisions, MapUtil.MAP_ENTRY_VALUE_COMPARATOR_DESC);
    Set<Integer> topNeighbours = new HashSet<>();
    for (Entry<Integer, Double> entry : topTotalNumberOfRevisionsEntries) {
      topNeighbours.add(entry.getKey());
    }
    return topNeighbours;
  }

  private static Map<Integer, Double> scoreRelatedPages(Set<Integer> relatedPages,
                                                  String wikipediaId,
                                                  int dayFrom,
                                                  int dayTo) {
    System.out.println("BA" + new SimpleDateFormat("HH:mm:ss").format(new Date()));
    Map<Integer, PageActivityFeaturesVector> pageActivityFeaturesVectors =
        PageActivityFeatures.getPagesActivityFeaturesVectors(relatedPages, wikipediaId,
                                                            dayFrom, dayTo);
    System.out.println("BB" + new SimpleDateFormat("HH:mm:ss").format(new Date()));
    Map<Integer, Double> relatedPageScores = new HashMap<>();
    for (int relatedPageId : relatedPages) {
      PageActivityFeaturesVector pageActivityFeaturesVector =
          pageActivityFeaturesVectors.get(relatedPageId);
      double score = PageActivityFeatures.computePageFeaturesVectorScore(pageActivityFeaturesVector);
      relatedPageScores.put(relatedPageId, score);
    }
    System.out.println("BC" + new SimpleDateFormat("HH:mm:ss").format(new Date()));
    return relatedPageScores;
  }

  private static List<PageIdScorePair> selectTopRelatedPages(Map<Integer, Double> relatedPageScores) {
    List<Entry<Integer, Double>> topRelatedPageScoreEntries =
        MapUtil.getTopEntries(relatedPageScores, MapUtil.MAP_ENTRY_VALUE_COMPARATOR_DESC, RELATED_PAGES_LIMIT);
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
        MapUtil.getTopEntries(neighbourScores, MapUtil.MAP_ENTRY_VALUE_COMPARATOR_DESC, NEIGHBOURS_LIMIT);
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
}
