package de.mpg.mpi.inf.d5.yavi.server;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import de.mpg.mpi.inf.d5.yavi.server.beans.DayNumberValuePair;
import de.mpg.mpi.inf.d5.yavi.server.beans.PageActivityFeaturesVector;
import de.mpg.mpi.inf.d5.yavi.server.providers.SignalProvider;

public class PageActivityFeatures {

  public static PageActivityFeaturesVector getPageActivityFeaturesVector(int pageId,
                                                          String wikipediaId,
                                                          int dayFrom,
                                                          int dayTo) {
    List<DayNumberValuePair> numberOfAddedInlinksList =
        SignalProvider.getNumberOfAddedInlinks(pageId, wikipediaId, dayFrom, dayTo);
    List<DayNumberValuePair> numberOfAddedOutlinksList =
        SignalProvider.getNumberOfAddedOutlinks(pageId, wikipediaId, dayFrom, dayTo);
    List<DayNumberValuePair> numberOfRevertedRevisionsList =
        SignalProvider.getNumberOfRevertedRevisions(pageId, wikipediaId, dayFrom, dayTo);
    List<DayNumberValuePair> numberOfRevisionsList =
        SignalProvider.getNumberOfRevisions(pageId, wikipediaId, dayFrom, dayTo);
    List<DayNumberValuePair> numberOfTotalOutlinksList =
        SignalProvider.getNumberOfTotalOutlinks(pageId, wikipediaId, dayFrom, dayTo);
    List<DayNumberValuePair> numberOfUniqueEditorsList =
        SignalProvider.getNumberOfUniqueEditors(pageId, wikipediaId, dayFrom, dayTo);
    List<DayNumberValuePair> pageContentSizeList =
        SignalProvider.getPageContentSize(pageId, wikipediaId, dayFrom, dayTo);
    return computePageActivityFeaturesVector(numberOfAddedInlinksList,
                                              numberOfAddedOutlinksList,
                                              numberOfRevertedRevisionsList,
                                              numberOfRevisionsList,
                                              numberOfTotalOutlinksList,
                                              numberOfUniqueEditorsList,
                                              pageContentSizeList,
                                              dayFrom,
                                              dayTo);
  }

  public static Map<Integer, PageActivityFeaturesVector> getPagesActivityFeaturesVectors(Set<Integer> pageIds,
                                                                        String wikipediaId,
                                                                        int dayFrom,
                                                                        int dayTo) {
    // Get data for all pages.
    Map<Integer, List<DayNumberValuePair>> indexedNumberOfAddedInlinksLists =
        SignalProvider.getNumberOfAddedInlinks(pageIds, wikipediaId, dayFrom, dayTo);
    Map<Integer, List<DayNumberValuePair>> indexedNumberOfAddedOutlinksLists =
        SignalProvider.getNumberOfAddedOutlinks(pageIds, wikipediaId, dayFrom, dayTo);
    Map<Integer, List<DayNumberValuePair>> indexedNumberOfRevertedRevisionsLists =
        SignalProvider.getNumberOfRevertedRevisions(pageIds, wikipediaId, dayFrom, dayTo);
    Map<Integer, List<DayNumberValuePair>> indexedNumberOfRevisionsLists =
        SignalProvider.getNumberOfRevisions(pageIds, wikipediaId, dayFrom, dayTo);
    Map<Integer, List<DayNumberValuePair>> indexedNumberOfTotalOutlinksLists =
        SignalProvider.getNumberOfTotalOutlinks(pageIds, wikipediaId, dayFrom, dayTo);
    Map<Integer, List<DayNumberValuePair>> indexedNumberOfUniqueEditorsLists =
        SignalProvider.getNumberOfUniqueEditors(pageIds, wikipediaId, dayFrom, dayTo);
    Map<Integer, List<DayNumberValuePair>> indexedPageContentSizeLists =
        SignalProvider.getPageContentSize(pageIds, wikipediaId, dayFrom, dayTo);
    // Compute popularity features for each page.
    Map<Integer, PageActivityFeaturesVector> pageActivityFeaturesVectors = new HashMap<>();
    for (int pageId : pageIds) {
      List<DayNumberValuePair> numberOfAddedInlinksList =
          indexedNumberOfAddedInlinksLists.get(pageId);
      List<DayNumberValuePair> numberOfAddedOutlinksList =
          indexedNumberOfAddedOutlinksLists.get(pageId);
      List<DayNumberValuePair> numberOfRevertedRevisionsList =
          indexedNumberOfRevertedRevisionsLists.get(pageId);
      List<DayNumberValuePair> numberOfRevisionsList =
          indexedNumberOfRevisionsLists.get(pageId);
      List<DayNumberValuePair> numberOfTotalOutlinksList =
          indexedNumberOfTotalOutlinksLists.get(pageId);
      List<DayNumberValuePair> numberOfUniqueEditorsList =
          indexedNumberOfUniqueEditorsLists.get(pageId);
      List<DayNumberValuePair> pageContentSizeList =
          indexedPageContentSizeLists.get(pageId);
      PageActivityFeaturesVector pageActivityFeaturesVector =
          computePageActivityFeaturesVector(numberOfAddedInlinksList, 
                                            numberOfAddedOutlinksList, 
                                            numberOfRevertedRevisionsList, 
                                            numberOfRevisionsList, 
                                            numberOfTotalOutlinksList, 
                                            numberOfUniqueEditorsList, 
                                            pageContentSizeList,
                                            dayFrom,
                                            dayTo);
      pageActivityFeaturesVectors.put(pageId, pageActivityFeaturesVector);
    }
    return pageActivityFeaturesVectors;
  }

  private static PageActivityFeaturesVector computePageActivityFeaturesVector(List<DayNumberValuePair> numberOfAddedInlinksList,
                                                                              List<DayNumberValuePair> numberOfAddedOutlinksList,
                                                                              List<DayNumberValuePair> numberOfRevertedRevisionsList,
                                                                              List<DayNumberValuePair> numberOfRevisionsList,
                                                                              List<DayNumberValuePair> numberOfTotalOutlinksList,
                                                                              List<DayNumberValuePair> numberOfUniqueEditorsList,
                                                                              List<DayNumberValuePair> pageContentSizeList,
                                                                              int dayFrom,
                                                                              int dayTo) {
    int periodLength = dayTo - dayFrom + 1;
    double totalNumberOfRevisions =
        computeSumOfValues(numberOfRevisionsList);
    double totalNumberOfRevertedRevisions =
        computeSumOfValues(numberOfRevertedRevisionsList);
    double percentageOfRevisionsReverted =
        computeSafePercentage(totalNumberOfRevertedRevisions, totalNumberOfRevisions);
    double numberOfRevisionsPeakOrder1 =
        computeMaxValue(numberOfRevisionsList);
    double numberOfRevisionsPeakOrder3 =
        computeMaxValueWindow(numberOfRevisionsList, 3);
    double numberOfRevisionsPeakOrder5 =
        computeMaxValueWindow(numberOfRevisionsList, 5);
    double numberOfRevisionsPeakOrder7 =
        computeMaxValueWindow(numberOfRevisionsList, 7);
    double numberOfRevisionsPeakOrder10 =
        computeMaxValueWindow(numberOfRevisionsList, 10);
    double numberOfUniqueEditorsDailyAverage =
        computeSumOfValues(numberOfUniqueEditorsList) / periodLength;
    double addedInlinksDailyAverage =
        computeSumOfValues(numberOfAddedInlinksList) / periodLength;
    double addedOutlinksDailyAverage =
        computeSumOfValues(numberOfAddedOutlinksList) / periodLength;
    double percentageIncreaseNumberOfTotalOutlinks =
        computePercentageIncreaseInValues(numberOfTotalOutlinksList);
    double percentageIncreasePageContentSize =
        computePercentageIncreaseInValues(pageContentSizeList);
    double aggregatedPercentageIncreasePageContentSize =
        computeAggregatedPercentageIncreaseInValues(pageContentSizeList);
    return new PageActivityFeaturesVector(totalNumberOfRevisions,
                                          totalNumberOfRevertedRevisions,
                                          percentageOfRevisionsReverted,
                                          numberOfRevisionsPeakOrder1,
                                          numberOfRevisionsPeakOrder3,
                                          numberOfRevisionsPeakOrder5,
                                          numberOfRevisionsPeakOrder7,
                                          numberOfRevisionsPeakOrder10,
                                          numberOfUniqueEditorsDailyAverage,
                                          addedInlinksDailyAverage,
                                          addedOutlinksDailyAverage,
                                          percentageIncreaseNumberOfTotalOutlinks,
                                          percentageIncreasePageContentSize,
                                          aggregatedPercentageIncreasePageContentSize);
  }

  private static double computeSumOfValues(List<DayNumberValuePair> pageActivitySignal) {
    double sumOfValues = 0.0;
    for (DayNumberValuePair dayNumberValuePair : pageActivitySignal) {
      sumOfValues += dayNumberValuePair.getValue();
    }
    return sumOfValues;
  }

  private static double computeMaxValue(List<DayNumberValuePair> pageActivitySignal) {
    if (pageActivitySignal.isEmpty()) {
      return 0;
    }
    int maxValue = pageActivitySignal.get(0).getValue();
    for (DayNumberValuePair dayNumberValuePair : pageActivitySignal) {
      int value = dayNumberValuePair.getValue();
      if (value > maxValue) {
        maxValue = value;
      }
    }
    return maxValue;
  }

  private static double computeMaxValueWindow(List<DayNumberValuePair> pageActivitySignal, int windowSize) {
    int queueLength = windowSize + 1;
    List<Integer> dayQueue = new ArrayList<>(Collections.nCopies(queueLength, -1));
    List<Integer> valueQueue = new ArrayList<>(Collections.nCopies(queueLength, -1));
    int queueBegin = 0;
    int queueEnd = 0;
    int valueQueueSum = 0, maxValueQueueSum = 0;
    for (DayNumberValuePair dayNumberValuePair : pageActivitySignal) {
      int day = dayNumberValuePair.getDayNumber();
      int value = dayNumberValuePair.getValue();
      // Vacate elements no longer within the window.
      while (queueBegin != queueEnd && dayQueue.get(queueBegin) <= day - windowSize) {
        valueQueueSum -= valueQueue.get(queueBegin);
        queueBegin = (queueBegin + 1) % queueLength;
      }
      dayQueue.set(queueEnd, day);
      valueQueue.set(queueEnd, value);
      valueQueueSum += value;
      if (valueQueueSum > maxValueQueueSum) {
        maxValueQueueSum = valueQueueSum; 
      }
      queueEnd = (queueEnd + 1) % queueLength;
    }
    return maxValueQueueSum;
  }

  private static double computePercentageIncreaseInValues(List<DayNumberValuePair> pageActivitySignal) {
    if (pageActivitySignal.isEmpty()) {
      return 0.0;
    }
    double firstDayValue = pageActivitySignal.get(0).getValue();
    double lastDayValue = pageActivitySignal.get(pageActivitySignal.size() - 1).getValue();
    return computePercentageIncrease(firstDayValue, lastDayValue);
  }

  private static double computeAggregatedPercentageIncreaseInValues(List<DayNumberValuePair> pageActivitySignal) {
    if (pageActivitySignal.isEmpty()) {
      return 0.0;
    }
    double aggregatedPercentageIncrease = 0.0;
    for (int i = 0; i < pageActivitySignal.size() - 1; ++i) {
      double dayValue = pageActivitySignal.get(i).getValue();
      double nextDayValue = pageActivitySignal.get(i + 1).getValue();
      double percentageIncrease = computePercentageIncrease(dayValue, nextDayValue);
      if (percentageIncrease >= 0.0) {
        aggregatedPercentageIncrease += percentageIncrease;
      } else {
        aggregatedPercentageIncrease -= percentageIncrease;
      }
    }
    return aggregatedPercentageIncrease;
  }

  private static double computeSafePercentage(double numerator, double denominator) {
    double ratio = numerator / denominator;
    if (Double.isNaN(ratio)) {
      return 0.0;
    }
    return 100.0 * ratio;
  }

  private static double computePercentageIncrease(double value, double nextValue) {
    return computeSafePercentage(nextValue - value, value);
  }

  public static double computePageFeaturesVectorScore(PageActivityFeaturesVector pageActivityFeaturesVector) {
    return 1.0 +
        1.0 * pageActivityFeaturesVector.getTotalNumberOfRevisions() +
        1.0 * pageActivityFeaturesVector.getTotalNumberOfRevertedRevisions() +
        1.0 * pageActivityFeaturesVector.getPercentageOfRevisionsReverted() +
        1.0 * pageActivityFeaturesVector.getNumberOfRevisionsPeakOrder1() +
        1.0 * pageActivityFeaturesVector.getNumberOfRevisionsPeakOrder3() +
        1.0 * pageActivityFeaturesVector.getNumberOfRevisionsPeakOrder5() +
        1.0 * pageActivityFeaturesVector.getNumberOfRevisionsPeakOrder7() +
        1.0 * pageActivityFeaturesVector.getNumberOfRevisionsPeakOrder10() +
        1.0 * pageActivityFeaturesVector.getNumberOfUniqueEditorsDailyAverage() +
        1.0 * pageActivityFeaturesVector.getAddedInlinksDailyAverage() +
        1.0 * pageActivityFeaturesVector.getAddedOutlinksDailyAverage() +
        1.0 * pageActivityFeaturesVector.getPercentageIncreaseNumberOfTotalOutlinks() +
        1.0 * pageActivityFeaturesVector.getPercentageIncreasePageContentSize() +
        1.0 * pageActivityFeaturesVector.getAggregatedPercentageIncreasePageContentSize();
  }
}
