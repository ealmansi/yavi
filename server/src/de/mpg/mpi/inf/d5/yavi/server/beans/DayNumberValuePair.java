package de.mpg.mpi.inf.d5.yavi.server.beans;

public class DayNumberValuePair {
  int dayNumber;
  int value;
  
  public DayNumberValuePair() {
  }
  
  public DayNumberValuePair(int dayNumber, int value) {
    this.dayNumber = dayNumber;
    this.value = value;
  }
  
  public int getDayNumber() {
    return dayNumber;
  }
  
  public void setDayNumber(int dayNumber) {
    this.dayNumber = dayNumber;
  }
  
  public int getValue() {
    return value;
  }
  
  public void setValue(int value) {
    this.value = value;
  }
}
