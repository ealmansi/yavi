package de.mpg.mpi.inf.d5.yavi.server.providers;

import java.util.ArrayList;
import java.util.List;

import de.mpg.mpi.inf.d5.yavi.server.tables.NumberOfAddedInlinks;
import de.mpg.mpi.inf.d5.yavi.server.tables.NumberOfAddedOutlinks;
import de.mpg.mpi.inf.d5.yavi.server.tables.NumberOfRevertedRevisions;
import de.mpg.mpi.inf.d5.yavi.server.tables.NumberOfRevisions;
import de.mpg.mpi.inf.d5.yavi.server.tables.NumberOfTotalOutlinks;
import de.mpg.mpi.inf.d5.yavi.server.tables.NumberOfUniqueEditors;
import de.mpg.mpi.inf.d5.yavi.server.tables.PageContentSize;
import de.mpg.mpi.inf.d5.yavi.server.util.DateUtil;
import de.mpg.mpi.inf.d5.yavi.server.util.DateValue;

public class SignalProvider {
  public List<DateValue> getNumberOfAddedInlinks(int pageId, String wikipediaId, int dayFrom, int dayTo) {
    List<DateValue> dayValueList = new ArrayList<DateValue>();
    List<NumberOfAddedInlinks> entries = ProviderUtil.getPageEntriesInRange("NumberOfAddedInlinks",
                                                                              pageId,
                                                                              wikipediaId,
                                                                              dayFrom, dayTo);
    for (NumberOfAddedInlinks entry : entries) {
      String date = DateUtil.dayNumberToDate(entry.getId().getDayNumber());
      DateValue dateValue = new DateValue(date, entry.getValue());
      dayValueList.add(dateValue);
    }
    return dayValueList;
  }

  public List<DateValue> getNumberOfAddedOutlinks(int pageId, String wikipediaId, int dayFrom, int dayTo) {
    List<DateValue> dayValueList = new ArrayList<DateValue>();
    List<NumberOfAddedOutlinks> entries = ProviderUtil.getPageEntriesInRange("NumberOfAddedOutlinks",
                                                                              pageId,
                                                                              wikipediaId,
                                                                              dayFrom, dayTo);
    for (NumberOfAddedOutlinks entry : entries) {
      String date = DateUtil.dayNumberToDate(entry.getId().getDayNumber());
      DateValue dateValue = new DateValue(date, entry.getValue());
      dayValueList.add(dateValue);
    }
    return dayValueList;
  }

  public List<DateValue> getNumberOfRevertedRevisions(int pageId, String wikipediaId, int dayFrom, int dayTo) {
    List<DateValue> dayValueList = new ArrayList<DateValue>();
    List<NumberOfRevertedRevisions> entries = ProviderUtil.getPageEntriesInRange("NumberOfRevertedRevisions",
                                                                              pageId,
                                                                              wikipediaId,
                                                                              dayFrom, dayTo);
    for (NumberOfRevertedRevisions entry : entries) {
      String date = DateUtil.dayNumberToDate(entry.getId().getDayNumber());
      DateValue dateValue = new DateValue(date, entry.getValue());
      dayValueList.add(dateValue);
    }
    return dayValueList;
  }

  public List<DateValue> getNumberOfRevisions(int pageId, String wikipediaId, int dayFrom, int dayTo) {
    List<DateValue> dayValueList = new ArrayList<DateValue>();
    List<NumberOfRevisions> entries = ProviderUtil.getPageEntriesInRange("NumberOfRevisions",
                                                                              pageId,
                                                                              wikipediaId,
                                                                              dayFrom, dayTo);
    for (NumberOfRevisions entry : entries) {
      String date = DateUtil.dayNumberToDate(entry.getId().getDayNumber());
      DateValue dateValue = new DateValue(date, entry.getValue());
      dayValueList.add(dateValue);
    }
    return dayValueList;
  }

  public List<DateValue> getNumberOfTotalOutlinks(int pageId, String wikipediaId, int dayFrom, int dayTo) {
    List<DateValue> dayValueList = new ArrayList<DateValue>();
    List<NumberOfTotalOutlinks> entries = ProviderUtil.getPageEntriesInRange("NumberOfTotalOutlinks",
                                                                              pageId,
                                                                              wikipediaId,
                                                                              dayFrom, dayTo);
    for (NumberOfTotalOutlinks entry : entries) {
      String date = DateUtil.dayNumberToDate(entry.getId().getDayNumber());
      DateValue dateValue = new DateValue(date, entry.getValue());
      dayValueList.add(dateValue);
    }
    return dayValueList;
  }

  public List<DateValue> getNumberOfUniqueEditors(int pageId, String wikipediaId, int dayFrom, int dayTo) {
    List<DateValue> dayValueList = new ArrayList<DateValue>();
    List<NumberOfUniqueEditors> entries = ProviderUtil.getPageEntriesInRange("NumberOfUniqueEditors",
                                                                              pageId,
                                                                              wikipediaId,
                                                                              dayFrom, dayTo);
    for (NumberOfUniqueEditors entry : entries) {
      String date = DateUtil.dayNumberToDate(entry.getId().getDayNumber());
      DateValue dateValue = new DateValue(date, entry.getValue());
      dayValueList.add(dateValue);
    }
    return dayValueList;
  }

  public List<DateValue> getPageContentSize(int pageId, String wikipediaId, int dayFrom, int dayTo) {
    List<DateValue> dayValueList = new ArrayList<DateValue>();
    List<PageContentSize> entries = ProviderUtil.getPageEntriesInRange("PageContentSize",
                                                                              pageId,
                                                                              wikipediaId,
                                                                              dayFrom, dayTo);
    for (PageContentSize entry : entries) {
      String date = DateUtil.dayNumberToDate(entry.getId().getDayNumber());
      DateValue dateValue = new DateValue(date, entry.getValue());
      dayValueList.add(dateValue);
    }
    return dayValueList;
  }
}
