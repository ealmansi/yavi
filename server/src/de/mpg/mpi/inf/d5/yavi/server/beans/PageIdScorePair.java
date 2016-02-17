package de.mpg.mpi.inf.d5.yavi.server.beans;

public class PageIdScorePair {
  int pageId;
  double score;
  
  public PageIdScorePair() {
  }
  
  public PageIdScorePair(int pageId, double score) {
    this.pageId = pageId;
    this.score = score;
  }
  
  public int getPageId() {
    return pageId;
  }
  
  public void setPageId(int pageId) {
    this.pageId = pageId;
  }
  
  public double getScore() {
    return score;
  }
  
  public void setScore(double score) {
    this.score = score;
  }
}
