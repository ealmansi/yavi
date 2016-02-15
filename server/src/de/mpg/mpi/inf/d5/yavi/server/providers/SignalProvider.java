package de.mpg.mpi.inf.d5.yavi.server.providers;

import java.util.ArrayList;
import java.util.List;

import de.mpg.mpi.inf.d5.yavi.server.entities.NumberOfAddedInlinks;
import de.mpg.mpi.inf.d5.yavi.server.entities.NumberOfAddedOutlinks;
import de.mpg.mpi.inf.d5.yavi.server.entities.NumberOfRevertedRevisions;
import de.mpg.mpi.inf.d5.yavi.server.entities.NumberOfRevisions;
import de.mpg.mpi.inf.d5.yavi.server.entities.NumberOfTotalOutlinks;
import de.mpg.mpi.inf.d5.yavi.server.entities.NumberOfUniqueEditors;
import de.mpg.mpi.inf.d5.yavi.server.entities.PageContentSize;
import de.mpg.mpi.inf.d5.yavi.server.util.DayValue;

public class SignalProvider {
  public List<DayValue> getNumberOfAddedInlinks(int pageId, String wikipediaId, int dayFrom, int dayTo) {
    List<DayValue> dayValueList = new ArrayList<DayValue>();
    List<NumberOfAddedInlinks> entries = ProviderUtil.getPageEntriesInRange("NumberOfAddedInlinks",
                                                                              pageId,
                                                                              wikipediaId,
                                                                              dayFrom, dayTo);
    for (NumberOfAddedInlinks entry : entries) {
      DayValue dateValue = new DayValue(entry.getId().getDayNumber(), entry.getValue());
      dayValueList.add(dateValue);
    }
    return dayValueList;
  }

  public List<DayValue> getNumberOfAddedOutlinks(int pageId, String wikipediaId, int dayFrom, int dayTo) {
    List<DayValue> dayValueList = new ArrayList<DayValue>();
    List<NumberOfAddedOutlinks> entries = ProviderUtil.getPageEntriesInRange("NumberOfAddedOutlinks",
                                                                              pageId,
                                                                              wikipediaId,
                                                                              dayFrom, dayTo);
    for (NumberOfAddedOutlinks entry : entries) {
      DayValue dateValue = new DayValue(entry.getId().getDayNumber(), entry.getValue());
      dayValueList.add(dateValue);
    }
    return dayValueList;
  }

  public List<DayValue> getNumberOfRevertedRevisions(int pageId, String wikipediaId, int dayFrom, int dayTo) {
    List<DayValue> dayValueList = new ArrayList<DayValue>();
    List<NumberOfRevertedRevisions> entries = ProviderUtil.getPageEntriesInRange("NumberOfRevertedRevisions",
                                                                              pageId,
                                                                              wikipediaId,
                                                                              dayFrom, dayTo);
    for (NumberOfRevertedRevisions entry : entries) {
      DayValue dateValue = new DayValue(entry.getId().getDayNumber(), entry.getValue());
      dayValueList.add(dateValue);
    }
    return dayValueList;
  }

  public List<DayValue> getNumberOfRevisions(int pageId, String wikipediaId, int dayFrom, int dayTo) {
    List<DayValue> dayValueList = new ArrayList<DayValue>();
    List<NumberOfRevisions> entries = ProviderUtil.getPageEntriesInRange("NumberOfRevisions",
                                                                              pageId,
                                                                              wikipediaId,
                                                                              dayFrom, dayTo);
    for (NumberOfRevisions entry : entries) {
      DayValue dateValue = new DayValue(entry.getId().getDayNumber(), entry.getValue());
      dayValueList.add(dateValue);
    }
    return dayValueList;
  }

  public List<DayValue> getNumberOfTotalOutlinks(int pageId, String wikipediaId, int dayFrom, int dayTo) {
    List<DayValue> dayValueList = new ArrayList<DayValue>();
    List<NumberOfTotalOutlinks> entries = ProviderUtil.getPageEntriesInRange("NumberOfTotalOutlinks",
                                                                              pageId,
                                                                              wikipediaId,
                                                                              dayFrom, dayTo);
    for (NumberOfTotalOutlinks entry : entries) {
      DayValue dateValue = new DayValue(entry.getId().getDayNumber(), entry.getValue());
      dayValueList.add(dateValue);
    }
    return dayValueList;
  }

  public List<DayValue> getNumberOfUniqueEditors(int pageId, String wikipediaId, int dayFrom, int dayTo) {
    List<DayValue> dayValueList = new ArrayList<DayValue>();
    List<NumberOfUniqueEditors> entries = ProviderUtil.getPageEntriesInRange("NumberOfUniqueEditors",
                                                                              pageId,
                                                                              wikipediaId,
                                                                              dayFrom, dayTo);
    for (NumberOfUniqueEditors entry : entries) {
      DayValue dateValue = new DayValue(entry.getId().getDayNumber(), entry.getValue());
      dayValueList.add(dateValue);
    }
    return dayValueList;
  }

  public List<DayValue> getPageContentSize(int pageId, String wikipediaId, int dayFrom, int dayTo) {
    List<DayValue> dayValueList = new ArrayList<DayValue>();
    List<PageContentSize> entries = ProviderUtil.getPageEntriesInRange("PageContentSize",
                                                                              pageId,
                                                                              wikipediaId,
                                                                              dayFrom, dayTo);
    for (PageContentSize entry : entries) {
      DayValue dateValue = new DayValue(entry.getId().getDayNumber(), entry.getValue());
      dayValueList.add(dateValue);
    }
    return dayValueList;
  }
}
