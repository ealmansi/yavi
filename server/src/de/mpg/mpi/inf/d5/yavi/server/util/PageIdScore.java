package de.mpg.mpi.inf.d5.yavi.server.util;

public class PageIdScore {
  private long pageId;
  private double score;

  public PageIdScore() {
  }
  
  public PageIdScore(long pageId, double score) {
    this.pageId = pageId;
    this.score = score;
  }
  
  public long getPageId() {
    return pageId;
  }

  public void setPageId(long pageId) {
    this.pageId = pageId;
  }

  public double getScore() {
    return score;
  }

  public void setScore(double score) {
    this.score = score;
  }
}