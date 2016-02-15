package de.mpg.mpi.inf.d5.yavi.server;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import de.mpg.mpi.inf.d5.yavi.server.providers.SignalProvider;
import de.mpg.mpi.inf.d5.yavi.server.util.DayValue;

public class PagePopularity {
  private static SignalProvider signalProvider = new SignalProvider();
  
  public static double computePopularityScore(int pageId, String wikipediaId, int dayFrom, int dayTo) {
    List<DayValue> numberOfAddedInlinksList =
        signalProvider.getNumberOfAddedInlinks(pageId, wikipediaId, dayFrom, dayTo);
    List<DayValue> numberOfAddedOutlinksList =
        signalProvider.getNumberOfAddedOutlinks(pageId, wikipediaId, dayFrom, dayTo);
    List<DayValue> numberOfRevertedRevisionsList =
        signalProvider.getNumberOfRevertedRevisions(pageId, wikipediaId, dayFrom, dayTo);
    List<DayValue> numberOfRevisionsList =
        signalProvider.getNumberOfRevisions(pageId, wikipediaId, dayFrom, dayTo);
    List<DayValue> numberOfTotalOutlinksList =
        signalProvider.getNumberOfTotalOutlinks(pageId, wikipediaId, dayFrom, dayTo);
    List<DayValue> numberOfUniqueEditorsList =
        signalProvider.getNumberOfUniqueEditors(pageId, wikipediaId, dayFrom, dayTo);
    List<DayValue> pageContentSizeList =
        signalProvider.getPageContentSize(pageId, wikipediaId, dayFrom, dayTo);

    int numberOfAddedInlinks = computeValueSum(numberOfAddedInlinksList);
    int numberOfAddedOutlinks = computeValueSum(numberOfAddedOutlinksList);
    int numberOfRevertedRevisions = computeValueSum(numberOfRevertedRevisionsList);
    int numberOfRevisions = computeValueSum(numberOfRevisionsList);
    int numberOfTotalOutlinks = computeValueSum(numberOfTotalOutlinksList);
    int numberOfUniqueEditors = computeValueSum(numberOfUniqueEditorsList);
    double pageContentSizeIncrease = computeValueIncrease(pageContentSizeList);

    int numberOfRevisionsPeakOrder1 = computeValueMax(numberOfRevisionsList);
    int numberOfRevisionsPeakOrder2 = computeValuePeak(numberOfRevisionsList, 2);
    int numberOfRevisionsPeakOrder5 = computeValuePeak(numberOfRevisionsList, 5);
    int numberOfRevisionsPeakOrder7 = computeValuePeak(numberOfRevisionsList, 7);
    int numberOfRevisionsPeakOrder10 = computeValuePeak(numberOfRevisionsList, 10);

    return 1.0 +
            0.0 * numberOfAddedInlinks +
            0.0 * numberOfAddedOutlinks +
            0.0 * numberOfRevertedRevisions +
            0.0 * numberOfRevisions +
            0.0 * numberOfTotalOutlinks +
            0.0 * numberOfUniqueEditors +
            0.0 * pageContentSizeIncrease +
            0.0 * numberOfRevisionsPeakOrder1 +
            0.0 * numberOfRevisionsPeakOrder2 +
            1.0 * numberOfRevisionsPeakOrder5 / (1 + numberOfRevisions) +
            0.0 * numberOfRevisionsPeakOrder7 +
            0.0 * numberOfRevisionsPeakOrder10;
  }

  private static int computeValueMax(List<DayValue> dayValueList) {
    if (dayValueList.isEmpty()) {
      return 0;
    }
    int maxValue = dayValueList.get(0).getValue();
    for (DayValue dayValue : dayValueList) {
      int value = dayValue.getValue();
      if (value > maxValue) {
        maxValue = value;
      }
    }
    return maxValue;
  }
  
  private static int computeValueSum(List<DayValue> dayValueList) {
    int sumOfValues = 0;
    for (DayValue dayValue : dayValueList) {
      sumOfValues += dayValue.getValue();
    }
    return sumOfValues;
  }
  
  private static double computeValueIncrease(List<DayValue> dayValueList) {
    if (dayValueList.isEmpty()) {
      return 0;
    }
    int firstDay = dayValueList.get(0).getDay(), lastDay = dayValueList.get(0).getDay();
    int firstDayValue = dayValueList.get(0).getValue(), lastDayValue = dayValueList.get(0).getValue();
    for (DayValue dayValue : dayValueList) {
      int day = dayValue.getDay();
      int value = dayValue.getValue();
      if (day < firstDay) {
        firstDay = day;
        firstDayValue = value;
      }
      if (day > lastDay) {
        lastDay = day;
        lastDayValue = value;
      }
    }
    return 1.0 * lastDayValue - firstDayValue / (firstDayValue + 1);
  }
  
  static int computeValuePeak(List<DayValue> dayValueList, int order) {
    int queueLength = order + 1;
    List<Integer> dayQueue = new ArrayList<>(Collections.nCopies(queueLength, -1));
    List<Integer> valueQueue = new ArrayList<>(Collections.nCopies(queueLength, -1));
    int queueBegin = 0;
    int queueEnd = 0;
    int valueQueueSum = 0, maxValueQueueSum = 0;
    for (DayValue dayValue : dayValueList) {
      int day = dayValue.getDay();
      int value = dayValue.getValue();
      // Vacate elements no longer within the window.
      while (queueBegin != queueEnd && dayQueue.get(queueBegin) <= day - order) {
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
}
