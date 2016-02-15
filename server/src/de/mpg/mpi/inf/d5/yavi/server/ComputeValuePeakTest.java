package de.mpg.mpi.inf.d5.yavi.server;

import java.util.ArrayList;
import java.util.List;

import org.junit.Test;

import de.mpg.mpi.inf.d5.yavi.server.util.DayValue;
import junit.framework.TestCase;

import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;

public class ComputeValuePeakTest extends TestCase {

  @Test
  public void test() {
    List<DayValue> dayValueList = new ArrayList<>();
    dayValueList.add(new DayValue(1, 1));
    dayValueList.add(new DayValue(2, 2));
    dayValueList.add(new DayValue(3, 3));
    dayValueList.add(new DayValue(4, 4));
    dayValueList.add(new DayValue(5, 5));
    dayValueList.add(new DayValue(6, 6));
    dayValueList.add(new DayValue(7, 7));
    dayValueList.add(new DayValue(8, 8));
    dayValueList.add(new DayValue(9, 7));
    dayValueList.add(new DayValue(10, 6));
    dayValueList.add(new DayValue(11, 5));
    dayValueList.add(new DayValue(12, 4));
    assertThat(PagePopularity.computeValuePeak(dayValueList, 2), is(15));
    assertThat(PagePopularity.computeValuePeak(dayValueList, 3), is(22));
    assertThat(PagePopularity.computeValuePeak(dayValueList, 4), is(28));
    assertThat(PagePopularity.computeValuePeak(dayValueList, 5), is(34));
    
    dayValueList = new ArrayList<>();
    dayValueList.add(new DayValue(1, 6));
    dayValueList.add(new DayValue(3, 2));
    assertThat(PagePopularity.computeValuePeak(dayValueList, 2), is(6));
    assertThat(PagePopularity.computeValuePeak(dayValueList, 3), is(8));
  }

}
