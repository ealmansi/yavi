package de.mpg.mpi.inf.d5.yavi.server.providers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import de.mpg.mpi.inf.d5.yavi.server.beans.DayNumberValuePair;
import de.mpg.mpi.inf.d5.yavi.server.entities.NumberOfAddedInlinks;
import de.mpg.mpi.inf.d5.yavi.server.entities.NumberOfAddedOutlinks;
import de.mpg.mpi.inf.d5.yavi.server.entities.NumberOfRevertedRevisions;
import de.mpg.mpi.inf.d5.yavi.server.entities.NumberOfRevisions;
import de.mpg.mpi.inf.d5.yavi.server.entities.NumberOfTotalOutlinks;
import de.mpg.mpi.inf.d5.yavi.server.entities.NumberOfUniqueEditors;
import de.mpg.mpi.inf.d5.yavi.server.entities.PageContentSize;

public class SignalProvider {
  public static List<DayNumberValuePair> getNumberOfAddedInlinks(int pageId,
                                                            String wikipediaId,
                                                            int dayFrom,
                                                            int dayTo) {
    List<DayNumberValuePair> pageActivitySignal = new ArrayList<DayNumberValuePair>();
    List<NumberOfAddedInlinks> entries =
        ProviderUtil.getPageEntriesInRange("NumberOfAddedInlinks", pageId,
                                            wikipediaId, dayFrom, dayTo);
    for (NumberOfAddedInlinks entry : entries) {
      int dayNumber = entry.getId().getDayNumber();
      int value = entry.getValue();
      pageActivitySignal.add(new DayNumberValuePair(dayNumber, value));
    }
    return pageActivitySignal;
  }

  public static List<DayNumberValuePair> getNumberOfAddedOutlinks(int pageId,
                                                            String wikipediaId,
                                                            int dayFrom,
                                                            int dayTo) {
    List<DayNumberValuePair> pageActivitySignal = new ArrayList<DayNumberValuePair>();
    List<NumberOfAddedOutlinks> entries =
        ProviderUtil.getPageEntriesInRange("NumberOfAddedOutlinks", pageId,
                                            wikipediaId, dayFrom, dayTo);
    for (NumberOfAddedOutlinks entry : entries) {
      int dayNumber = entry.getId().getDayNumber();
      int value = entry.getValue();
      pageActivitySignal.add(new DayNumberValuePair(dayNumber, value));
    }
    return pageActivitySignal;
  }

  public static List<DayNumberValuePair> getNumberOfRevertedRevisions(int pageId,
                                                            String wikipediaId,
                                                            int dayFrom,
                                                            int dayTo) {
    List<DayNumberValuePair> pageActivitySignal = new ArrayList<DayNumberValuePair>();
    List<NumberOfRevertedRevisions> entries =
        ProviderUtil.getPageEntriesInRange("NumberOfRevertedRevisions", pageId,
                                            wikipediaId, dayFrom, dayTo);
    for (NumberOfRevertedRevisions entry : entries) {
      int dayNumber = entry.getId().getDayNumber();
      int value = entry.getValue();
      pageActivitySignal.add(new DayNumberValuePair(dayNumber, value));
    }
    return pageActivitySignal;
  }

  public static List<DayNumberValuePair> getNumberOfRevisions(int pageId,
                                                            String wikipediaId,
                                                            int dayFrom,
                                                            int dayTo) {
    List<DayNumberValuePair> pageActivitySignal = new ArrayList<DayNumberValuePair>();
    List<NumberOfRevisions> entries =
        ProviderUtil.getPageEntriesInRange("NumberOfRevisions", pageId,
                                            wikipediaId, dayFrom, dayTo);
    for (NumberOfRevisions entry : entries) {
      int dayNumber = entry.getId().getDayNumber();
      int value = entry.getValue();
      pageActivitySignal.add(new DayNumberValuePair(dayNumber, value));
    }
    return pageActivitySignal;
  }

  public static List<DayNumberValuePair> getNumberOfTotalOutlinks(int pageId,
                                                            String wikipediaId,
                                                            int dayFrom,
                                                            int dayTo) {
    List<DayNumberValuePair> pageActivitySignal = new ArrayList<DayNumberValuePair>();
    List<NumberOfTotalOutlinks> entries =
        ProviderUtil.getPageEntriesInRange("NumberOfTotalOutlinks", pageId,
                                            wikipediaId, dayFrom, dayTo);
    for (NumberOfTotalOutlinks entry : entries) {
      int dayNumber = entry.getId().getDayNumber();
      int value = entry.getValue();
      pageActivitySignal.add(new DayNumberValuePair(dayNumber, value));
    }
    return pageActivitySignal;
  }

  public static List<DayNumberValuePair> getNumberOfUniqueEditors(int pageId,
                                                            String wikipediaId,
                                                            int dayFrom,
                                                            int dayTo) {
    List<DayNumberValuePair> pageActivitySignal = new ArrayList<DayNumberValuePair>();
    List<NumberOfUniqueEditors> entries =
        ProviderUtil.getPageEntriesInRange("NumberOfUniqueEditors", pageId,
                                            wikipediaId, dayFrom, dayTo);
    for (NumberOfUniqueEditors entry : entries) {
      int dayNumber = entry.getId().getDayNumber();
      int value = entry.getValue();
      pageActivitySignal.add(new DayNumberValuePair(dayNumber, value));
    }
    return pageActivitySignal;
  }

  public static List<DayNumberValuePair> getPageContentSize(int pageId,
                                                            String wikipediaId,
                                                            int dayFrom,
                                                            int dayTo) {
    List<DayNumberValuePair> pageActivitySignal = new ArrayList<DayNumberValuePair>();
    List<PageContentSize> entries =
        ProviderUtil.getPageEntriesInRange("PageContentSize", pageId,
                                            wikipediaId, dayFrom, dayTo);
    for (PageContentSize entry : entries) {
      int dayNumber = entry.getId().getDayNumber();
      int value = entry.getValue();
      pageActivitySignal.add(new DayNumberValuePair(dayNumber, value));
    }
    return pageActivitySignal;
  }

  //
  public static Map<Integer, List<DayNumberValuePair>> getNumberOfAddedInlinks(Set<Integer> pageIds,
                                                                        String wikipediaId,
                                                                        int dayFrom,
                                                                        int dayTo) {
    List<NumberOfAddedInlinks> numberOfAddedInlinksList =
        ProviderUtil.getPagesEntriesInRange("NumberOfAddedInlinks", pageIds,
                                            wikipediaId, dayFrom, dayTo);
    Map<Integer, List<DayNumberValuePair>> indexedPageActivitySignals = new HashMap<>();
    for (int pageId : pageIds) {
      indexedPageActivitySignals.put(pageId, new ArrayList<DayNumberValuePair>());
    }
    for (NumberOfAddedInlinks numberOfAddedInlinks : numberOfAddedInlinksList) {
      int pageId = numberOfAddedInlinks.getId().getPageId();
      int dayNumber = numberOfAddedInlinks.getId().getDayNumber();
      int value = numberOfAddedInlinks.getValue();
      List<DayNumberValuePair> pageActivitySignal = indexedPageActivitySignals.get(pageId);
      pageActivitySignal.add(new DayNumberValuePair(dayNumber, value));
    }
    return indexedPageActivitySignals;
  }

  public static Map<Integer, List<DayNumberValuePair>> getNumberOfAddedOutlinks(Set<Integer> pageIds,
                                                                        String wikipediaId,
                                                                        int dayFrom,
                                                                        int dayTo) {
    List<NumberOfAddedOutlinks> numberOfAddedOutlinksList =
        ProviderUtil.getPagesEntriesInRange("NumberOfAddedOutlinks", pageIds,
                                            wikipediaId, dayFrom, dayTo);
    Map<Integer, List<DayNumberValuePair>> indexedPageActivitySignals = new HashMap<>();
    for (int pageId : pageIds) {
      indexedPageActivitySignals.put(pageId, new ArrayList<DayNumberValuePair>());
    }
    for (NumberOfAddedOutlinks numberOfAddedOutlinks : numberOfAddedOutlinksList) {
      int pageId = numberOfAddedOutlinks.getId().getPageId();
      int dayNumber = numberOfAddedOutlinks.getId().getDayNumber();
      int value = numberOfAddedOutlinks.getValue();
      List<DayNumberValuePair> pageActivitySignal = indexedPageActivitySignals.get(pageId);
      pageActivitySignal.add(new DayNumberValuePair(dayNumber, value));
    }
    return indexedPageActivitySignals;
  }

  public static Map<Integer, List<DayNumberValuePair>> getNumberOfRevertedRevisions(Set<Integer> pageIds,
                                                                        String wikipediaId,
                                                                        int dayFrom,
                                                                        int dayTo) {
    List<NumberOfRevertedRevisions> numberOfRevertedRevisionsList =
        ProviderUtil.getPagesEntriesInRange("NumberOfRevertedRevisions", pageIds,
                                            wikipediaId, dayFrom, dayTo);
    Map<Integer, List<DayNumberValuePair>> indexedPageActivitySignals = new HashMap<>();
    for (int pageId : pageIds) {
      indexedPageActivitySignals.put(pageId, new ArrayList<DayNumberValuePair>());
    }
    for (NumberOfRevertedRevisions numberOfRevertedRevisions : numberOfRevertedRevisionsList) {
      int pageId = numberOfRevertedRevisions.getId().getPageId();
      int dayNumber = numberOfRevertedRevisions.getId().getDayNumber();
      int value = numberOfRevertedRevisions.getValue();
      List<DayNumberValuePair> pageActivitySignal = indexedPageActivitySignals.get(pageId);
      pageActivitySignal.add(new DayNumberValuePair(dayNumber, value));
    }
    return indexedPageActivitySignals;
  }

  public static Map<Integer, List<DayNumberValuePair>> getNumberOfRevisions(Set<Integer> pageIds,
                                                                        String wikipediaId,
                                                                        int dayFrom,
                                                                        int dayTo) {
    List<NumberOfRevisions> numberOfRevisionsList =
        ProviderUtil.getPagesEntriesInRange("NumberOfRevisions", pageIds,
                                            wikipediaId, dayFrom, dayTo);
    Map<Integer, List<DayNumberValuePair>> indexedPageActivitySignals = new HashMap<>();
    for (int pageId : pageIds) {
      indexedPageActivitySignals.put(pageId, new ArrayList<DayNumberValuePair>());
    }
    for (NumberOfRevisions numberOfRevisions : numberOfRevisionsList) {
      int pageId = numberOfRevisions.getId().getPageId();
      int dayNumber = numberOfRevisions.getId().getDayNumber();
      int value = numberOfRevisions.getValue();
      List<DayNumberValuePair> pageActivitySignal = indexedPageActivitySignals.get(pageId);
      pageActivitySignal.add(new DayNumberValuePair(dayNumber, value));
    }
    return indexedPageActivitySignals;
  }

  public static Map<Integer, List<DayNumberValuePair>> getNumberOfTotalOutlinks(Set<Integer> pageIds,
                                                                        String wikipediaId,
                                                                        int dayFrom,
                                                                        int dayTo) {
    List<NumberOfTotalOutlinks> numberOfTotalOutlinksList =
        ProviderUtil.getPagesEntriesInRange("NumberOfTotalOutlinks", pageIds,
                                            wikipediaId, dayFrom, dayTo);
    Map<Integer, List<DayNumberValuePair>> indexedPageActivitySignals = new HashMap<>();
    for (int pageId : pageIds) {
      indexedPageActivitySignals.put(pageId, new ArrayList<DayNumberValuePair>());
    }
    for (NumberOfTotalOutlinks numberOfTotalOutlinks : numberOfTotalOutlinksList) {
      int pageId = numberOfTotalOutlinks.getId().getPageId();
      int dayNumber = numberOfTotalOutlinks.getId().getDayNumber();
      int value = numberOfTotalOutlinks.getValue();
      List<DayNumberValuePair> pageActivitySignal = indexedPageActivitySignals.get(pageId);
      pageActivitySignal.add(new DayNumberValuePair(dayNumber, value));
    }
    return indexedPageActivitySignals;
  }

  public static Map<Integer, List<DayNumberValuePair>> getNumberOfUniqueEditors(Set<Integer> pageIds,
                                                                        String wikipediaId,
                                                                        int dayFrom,
                                                                        int dayTo) {
    List<NumberOfUniqueEditors> numberOfUniqueEditorsList =
        ProviderUtil.getPagesEntriesInRange("NumberOfUniqueEditors", pageIds,
                                            wikipediaId, dayFrom, dayTo);
    Map<Integer, List<DayNumberValuePair>> indexedPageActivitySignals = new HashMap<>();
    for (int pageId : pageIds) {
      indexedPageActivitySignals.put(pageId, new ArrayList<DayNumberValuePair>());
    }
    for (NumberOfUniqueEditors numberOfUniqueEditors : numberOfUniqueEditorsList) {
      int pageId = numberOfUniqueEditors.getId().getPageId();
      int dayNumber = numberOfUniqueEditors.getId().getDayNumber();
      int value = numberOfUniqueEditors.getValue();
      List<DayNumberValuePair> pageActivitySignal = indexedPageActivitySignals.get(pageId);
      pageActivitySignal.add(new DayNumberValuePair(dayNumber, value));
    }
    return indexedPageActivitySignals;
  }

  public static Map<Integer, List<DayNumberValuePair>> getPageContentSize(Set<Integer> pageIds,
                                                                        String wikipediaId,
                                                                        int dayFrom,
                                                                        int dayTo) {
    List<PageContentSize> pageContentSizeList =
        ProviderUtil.getPagesEntriesInRange("PageContentSize", pageIds,
                                            wikipediaId, dayFrom, dayTo);
    Map<Integer, List<DayNumberValuePair>> indexedPageActivitySignals = new HashMap<>();
    for (int pageId : pageIds) {
      indexedPageActivitySignals.put(pageId, new ArrayList<DayNumberValuePair>());
    }
    for (PageContentSize pageContentSize : pageContentSizeList) {
      int pageId = pageContentSize.getId().getPageId();
      int dayNumber = pageContentSize.getId().getDayNumber();
      int value = pageContentSize.getValue();
      List<DayNumberValuePair> pageActivitySignal = indexedPageActivitySignals.get(pageId);
      pageActivitySignal.add(new DayNumberValuePair(dayNumber, value));
    }
    return indexedPageActivitySignals;
  }
}
