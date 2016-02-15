package de.mpg.mpi.inf.d5.yavi.server.util;

public class DayValue {
  private int day;
  private int value;
  
  public DayValue() {
    
  }
  
  public DayValue(int day, int value) {
    this.day = day;
    this.value = value;
  }
  
  public int getDay() {
    return day;
  }
  
  public void setDay(int day) {
    this.day = day;
  }
  
  public int getValue() {
    return value;
  }
  
  public void setValue(int value) {
    this.value = value;
  }
}
