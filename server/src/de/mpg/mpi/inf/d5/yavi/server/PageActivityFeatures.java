package de.mpg.mpi.inf.d5.yavi.server;

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
        PageActivitySignalUtil.computeSumOfValues(numberOfRevisionsList);
    double totalNumberOfRevertedRevisions =
        PageActivitySignalUtil.computeSumOfValues(numberOfRevertedRevisionsList);
    double percentageOfRevisionsReverted =
        PageActivitySignalUtil.computeSafePercentage(totalNumberOfRevertedRevisions, totalNumberOfRevisions);
    double numberOfRevisionsPeakOrder1 =
        PageActivitySignalUtil.computeMaxValue(numberOfRevisionsList);
    double numberOfRevisionsPeakOrder3 =
        PageActivitySignalUtil.computeMaxValueWindow(numberOfRevisionsList, 3);
    double numberOfRevisionsPeakOrder5 =
        PageActivitySignalUtil.computeMaxValueWindow(numberOfRevisionsList, 5);
    double numberOfRevisionsPeakOrder7 =
        PageActivitySignalUtil.computeMaxValueWindow(numberOfRevisionsList, 7);
    double numberOfRevisionsPeakOrder10 =
        PageActivitySignalUtil.computeMaxValueWindow(numberOfRevisionsList, 10);
    double numberOfUniqueEditorsDailyAverage =
        PageActivitySignalUtil.computeSumOfValues(numberOfUniqueEditorsList) / periodLength;
    double addedInlinksDailyAverage =
        PageActivitySignalUtil.computeSumOfValues(numberOfAddedInlinksList) / periodLength;
    double addedOutlinksDailyAverage =
        PageActivitySignalUtil.computeSumOfValues(numberOfAddedOutlinksList) / periodLength;
    double percentageIncreaseNumberOfTotalOutlinks =
        PageActivitySignalUtil.computePercentageIncreaseInValues(numberOfTotalOutlinksList);
    double percentageIncreasePageContentSize =
        PageActivitySignalUtil.computePercentageIncreaseInValues(pageContentSizeList);
    double aggregatedPercentageIncreasePageContentSize =
        PageActivitySignalUtil.computeAggregatedPercentageIncreaseInValues(pageContentSizeList);
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
