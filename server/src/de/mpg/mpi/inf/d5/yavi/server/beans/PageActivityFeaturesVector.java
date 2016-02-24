package de.mpg.mpi.inf.d5.yavi.server.beans;

public class PageActivityFeaturesVector {
  double totalNumberOfRevisions;
  double totalNumberOfRevertedRevisions;
  double percentageOfRevisionsReverted;
  double numberOfRevisionsPeakOrder1;
  double numberOfRevisionsPeakOrder3;
  double numberOfRevisionsPeakOrder5;
  double numberOfRevisionsPeakOrder7;
  double numberOfRevisionsPeakOrder10;
  double numberOfUniqueEditorsDailyAverage;
  double addedInlinksDailyAverage;
  double addedOutlinksDailyAverage;
  double percentageIncreaseNumberOfTotalOutlinks;
  double percentageIncreasePageContentSize;
  double aggregatedPercentageIncreasePageContentSize;
  
  public PageActivityFeaturesVector() {
    
  }
  
  public PageActivityFeaturesVector(double totalNumberOfRevisions, double totalNumberOfRevertedRevisions,
      double percentageOfRevisionsReverted, double numberOfRevisionsPeakOrder1, double numberOfRevisionsPeakOrder3,
      double numberOfRevisionsPeakOrder5, double numberOfRevisionsPeakOrder7, double numberOfRevisionsPeakOrder10,
      double numberOfUniqueEditorsDailyAverage, double addedInlinksDailyAverage, double addedOutlinksDailyAverage,
      double percentageIncreaseNumberOfTotalOutlinks, double percentageIncreasePageContentSize,
      double aggregatedPercentageIncreasePageContentSize) {
    this.totalNumberOfRevisions = totalNumberOfRevisions;
    this.totalNumberOfRevertedRevisions = totalNumberOfRevertedRevisions;
    this.percentageOfRevisionsReverted = percentageOfRevisionsReverted;
    this.numberOfRevisionsPeakOrder1 = numberOfRevisionsPeakOrder1;
    this.numberOfRevisionsPeakOrder3 = numberOfRevisionsPeakOrder3;
    this.numberOfRevisionsPeakOrder5 = numberOfRevisionsPeakOrder5;
    this.numberOfRevisionsPeakOrder7 = numberOfRevisionsPeakOrder7;
    this.numberOfRevisionsPeakOrder10 = numberOfRevisionsPeakOrder10;
    this.numberOfUniqueEditorsDailyAverage = numberOfUniqueEditorsDailyAverage;
    this.addedInlinksDailyAverage = addedInlinksDailyAverage;
    this.addedOutlinksDailyAverage = addedOutlinksDailyAverage;
    this.percentageIncreaseNumberOfTotalOutlinks = percentageIncreaseNumberOfTotalOutlinks;
    this.percentageIncreasePageContentSize = percentageIncreasePageContentSize;
    this.aggregatedPercentageIncreasePageContentSize = aggregatedPercentageIncreasePageContentSize;
  }
  
  public double getTotalNumberOfRevisions() {
    return totalNumberOfRevisions;
  }
  
  public void setTotalNumberOfRevisions(double totalNumberOfRevisions) {
    this.totalNumberOfRevisions = totalNumberOfRevisions;
  }
  
  public double getTotalNumberOfRevertedRevisions() {
    return totalNumberOfRevertedRevisions;
  }
  
  public void setTotalNumberOfRevertedRevisions(double totalNumberOfRevertedRevisions) {
    this.totalNumberOfRevertedRevisions = totalNumberOfRevertedRevisions;
  }
  
  public double getPercentageOfRevisionsReverted() {
    return percentageOfRevisionsReverted;
  }
  
  public void setPercentageOfRevisionsReverted(double percentageOfRevisionsReverted) {
    this.percentageOfRevisionsReverted = percentageOfRevisionsReverted;
  }
  
  public double getNumberOfRevisionsPeakOrder1() {
    return numberOfRevisionsPeakOrder1;
  }
  
  public void setNumberOfRevisionsPeakOrder1(double numberOfRevisionsPeakOrder1) {
    this.numberOfRevisionsPeakOrder1 = numberOfRevisionsPeakOrder1;
  }
  
  public double getNumberOfRevisionsPeakOrder3() {
    return numberOfRevisionsPeakOrder3;
  }
  
  public void setNumberOfRevisionsPeakOrder3(double numberOfRevisionsPeakOrder3) {
    this.numberOfRevisionsPeakOrder3 = numberOfRevisionsPeakOrder3;
  }
  
  public double getNumberOfRevisionsPeakOrder5() {
    return numberOfRevisionsPeakOrder5;
  }
  
  public void setNumberOfRevisionsPeakOrder5(double numberOfRevisionsPeakOrder5) {
    this.numberOfRevisionsPeakOrder5 = numberOfRevisionsPeakOrder5;
  }
  
  public double getNumberOfRevisionsPeakOrder7() {
    return numberOfRevisionsPeakOrder7;
  }
  
  public void setNumberOfRevisionsPeakOrder7(double numberOfRevisionsPeakOrder7) {
    this.numberOfRevisionsPeakOrder7 = numberOfRevisionsPeakOrder7;
  }
  
  public double getNumberOfRevisionsPeakOrder10() {
    return numberOfRevisionsPeakOrder10;
  }
  
  public void setNumberOfRevisionsPeakOrder10(double numberOfRevisionsPeakOrder10) {
    this.numberOfRevisionsPeakOrder10 = numberOfRevisionsPeakOrder10;
  }
  
  public double getNumberOfUniqueEditorsDailyAverage() {
    return numberOfUniqueEditorsDailyAverage;
  }
  
  public void setNumberOfUniqueEditorsDailyAverage(double numberOfUniqueEditorsDailyAverage) {
    this.numberOfUniqueEditorsDailyAverage = numberOfUniqueEditorsDailyAverage;
  }
  
  public double getAddedInlinksDailyAverage() {
    return addedInlinksDailyAverage;
  }
  
  public void setAddedInlinksDailyAverage(double addedInlinksDailyAverage) {
    this.addedInlinksDailyAverage = addedInlinksDailyAverage;
  }
  
  public double getAddedOutlinksDailyAverage() {
    return addedOutlinksDailyAverage;
  }
  
  public void setAddedOutlinksDailyAverage(double addedOutlinksDailyAverage) {
    this.addedOutlinksDailyAverage = addedOutlinksDailyAverage;
  }
  
  public double getPercentageIncreaseNumberOfTotalOutlinks() {
    return percentageIncreaseNumberOfTotalOutlinks;
  }
  
  public void setPercentageIncreaseNumberOfTotalOutlinks(double percentageIncreaseNumberOfTotalOutlinks) {
    this.percentageIncreaseNumberOfTotalOutlinks = percentageIncreaseNumberOfTotalOutlinks;
  }
  
  public double getPercentageIncreasePageContentSize() {
    return percentageIncreasePageContentSize;
  }
  
  public void setPercentageIncreasePageContentSize(double percentageIncreasePageContentSize) {
    this.percentageIncreasePageContentSize = percentageIncreasePageContentSize;
  }
  
  public double getAggregatedPercentageIncreasePageContentSize() {
    return aggregatedPercentageIncreasePageContentSize;
  }
  
  public void setAggregatedPercentageIncreasePageContentSize(double aggregatedPercentageIncreasePageContentSize) {
    this.aggregatedPercentageIncreasePageContentSize = aggregatedPercentageIncreasePageContentSize;
  }
}
