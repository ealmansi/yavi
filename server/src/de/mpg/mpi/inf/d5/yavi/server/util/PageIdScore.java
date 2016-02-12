package de.mpg.mpi.inf.d5.yavi.server.util;

public class PageIdScore {
  private int pageId;
  private double score;

  public PageIdScore() {
  }
  
  public PageIdScore(int pageId, double score) {
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
