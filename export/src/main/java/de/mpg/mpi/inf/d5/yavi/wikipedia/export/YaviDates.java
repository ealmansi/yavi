package de.mpg.mpi.inf.d5.yavi.wikipedia.export;

import org.joda.time.DateTime;
import org.joda.time.Days;

/**
 * YaviDates
 */
public class YaviDates {
  /**
   * Definition of absolute zero day.
   */
  private static final DateTime DAY_ZERO = new DateTime(2000, 1, 1, 0, 0, 0);

  /**
   * timestampToDayNumber
   */
  public static int timestampToDayNumber(String timestamp) {
    return Days.daysBetween(DAY_ZERO, new DateTime(timestamp)).getDays();
  }
}
