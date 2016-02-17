package de.mpg.mpi.inf.d5.yavi.server.beans;

public class DateValuePair {
  String date;
  int value;
  
  public DateValuePair() {
  }
  
  public DateValuePair(String date, int value) {
    this.date = date;
    this.value = value;
  }
  
  public String getDate() {
    return date;
  }
  
  public void setDate(String date) {
    this.date = date;
  }
  
  public int getValue() {
    return value;
  }
  
  public void setValue(int value) {
    this.value = value;
  }
}
