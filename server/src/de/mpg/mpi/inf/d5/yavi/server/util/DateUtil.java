package de.mpg.mpi.inf.d5.yavi.server.util;

import org.joda.time.DateTime;
import org.joda.time.Days;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;

public class DateUtil {
  private static final DateTime DAY_ZERO = new DateTime(2000, 1, 1, 0, 0, 0);
  private static final DateTimeFormatter DATE_FORMAT = DateTimeFormat.forPattern("yyyy-MM-dd");

  public static String dayNumberToDate(int dayNumber) {
    return dateTimeToString(DAY_ZERO.plusDays(dayNumber));
  }

  public static int dateToDayNumber(String date) {
    return Days.daysBetween(DAY_ZERO, stringToDateTime(date)).getDays();
  }
  
  public static DateTime stringToDateTime(String date) {
    return DATE_FORMAT.parseDateTime(date);
  }
  
  public static String dateTimeToString(DateTime date) {
    return DATE_FORMAT.print(date);
  }
}
