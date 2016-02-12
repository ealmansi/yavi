package de.mpg.mpi.inf.d5.yavi.server.providers;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.Query;

import com.google.common.base.Joiner;

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
  public List<DateValue> getNumberOfAddedInlinks(long pageId, String wikipediaId, int dayFrom, int dayTo) {
    List<DateValue> dayValueList = new ArrayList<DateValue>();
    List<NumberOfAddedInlinks> entries =
        getPageEntriesInRange("NumberOfAddedInlinks", pageId, wikipediaId, dayFrom, dayTo);
    for (NumberOfAddedInlinks entry : entries) {
      String date = DateUtil.dayNumberToDate(entry.getId().getDayNumber());
      DateValue dateValue = new DateValue(date, entry.getValue());
      dayValueList.add(dateValue);
    }
    return dayValueList;
  }

  public List<DateValue> getNumberOfAddedOutlinks(long pageId, String wikipediaId, int dayFrom, int dayTo) {
    List<DateValue> dayValueList = new ArrayList<DateValue>();
    List<NumberOfAddedOutlinks> entries =
        getPageEntriesInRange("NumberOfAddedOutlinks", pageId, wikipediaId, dayFrom, dayTo);
    for (NumberOfAddedOutlinks entry : entries) {
      String date = DateUtil.dayNumberToDate(entry.getId().getDayNumber());
      DateValue dateValue = new DateValue(date, entry.getValue());
      dayValueList.add(dateValue);
    }
    return dayValueList;
  }

  public List<DateValue> getNumberOfRevertedRevisions(long pageId, String wikipediaId, int dayFrom, int dayTo) {
    List<DateValue> dayValueList = new ArrayList<DateValue>();
    List<NumberOfRevertedRevisions> entries =
        getPageEntriesInRange("NumberOfRevertedRevisions", pageId, wikipediaId, dayFrom, dayTo);
    for (NumberOfRevertedRevisions entry : entries) {
      String date = DateUtil.dayNumberToDate(entry.getId().getDayNumber());
      DateValue dateValue = new DateValue(date, entry.getValue());
      dayValueList.add(dateValue);
    }
    return dayValueList;
  }

  public List<DateValue> getNumberOfRevisions(long pageId, String wikipediaId, int dayFrom, int dayTo) {
    List<DateValue> dayValueList = new ArrayList<DateValue>();
    List<NumberOfRevisions> entries =
        getPageEntriesInRange("NumberOfRevisions", pageId, wikipediaId, dayFrom, dayTo);
    for (NumberOfRevisions entry : entries) {
      String date = DateUtil.dayNumberToDate(entry.getId().getDayNumber());
      DateValue dateValue = new DateValue(date, entry.getValue());
      dayValueList.add(dateValue);
    }
    return dayValueList;
  }

  public List<DateValue> getNumberOfTotalOutlinks(long pageId, String wikipediaId, int dayFrom, int dayTo) {
    List<DateValue> dayValueList = new ArrayList<DateValue>();
    List<NumberOfTotalOutlinks> entries =
        getPageEntriesInRange("NumberOfTotalOutlinks", pageId, wikipediaId, dayFrom, dayTo);
    for (NumberOfTotalOutlinks entry : entries) {
      String date = DateUtil.dayNumberToDate(entry.getId().getDayNumber());
      DateValue dateValue = new DateValue(date, entry.getValue());
      dayValueList.add(dateValue);
    }
    return dayValueList;
  }

  public List<DateValue> getNumberOfUniqueEditors(long pageId, String wikipediaId, int dayFrom, int dayTo) {
    List<DateValue> dayValueList = new ArrayList<DateValue>();
    List<NumberOfUniqueEditors> entries =
        getPageEntriesInRange("NumberOfUniqueEditors", pageId, wikipediaId, dayFrom, dayTo);
    for (NumberOfUniqueEditors entry : entries) {
      String date = DateUtil.dayNumberToDate(entry.getId().getDayNumber());
      DateValue dateValue = new DateValue(date, entry.getValue());
      dayValueList.add(dateValue);
    }
    return dayValueList;
  }

  public List<DateValue> getPageContentSize(long pageId, String wikipediaId, int dayFrom, int dayTo) {
    List<DateValue> dayValueList = new ArrayList<DateValue>();
    List<PageContentSize> entries =
        getPageEntriesInRange("PageContentSize", pageId, wikipediaId, dayFrom, dayTo);
    for (PageContentSize entry : entries) {
      String date = DateUtil.dayNumberToDate(entry.getId().getDayNumber());
      DateValue dateValue = new DateValue(date, entry.getValue());
      dayValueList.add(dateValue);
    }
    return dayValueList;
  }

  @SuppressWarnings("unchecked")
  private <T> List<T> getPageEntriesInRange(String table, long pageId, String wikipediaId, int dayFrom, int dayTo) {
    EntityManager entityManager = ProviderUtil.getEntityManagerByWikipediaId(wikipediaId);
    String queryStatement = Joiner.on("\n").join(
        "SELECT e",
        "FROM " + table + " e",
        "WHERE",
          "e.id.pageId = :pageId AND",
          "e.id.dayNumber >= :dayFrom AND",
          "e.id.dayNumber <= :dayTo"
    );
    Query query = entityManager.createQuery(queryStatement);
    query.setParameter("pageId", pageId);
    query.setParameter("dayFrom", dayFrom);
    query.setParameter("dayTo", dayTo);
    return query.getResultList();
  }
}
