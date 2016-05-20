package de.mpg.mpi.inf.d5.wiki.spark.jobs

import de.mpg.mpi.inf.d5.wiki.spark.JobUtility
import org.apache.spark.SparkConf
import org.apache.spark.SparkContext
import org.apache.spark.sql.hive.HiveContext
import org.apache.spark.sql.SaveMode

/**
 * BuildPageOutlinks
 */
object BuildPageOutlinks {

  /**
   * Job entry point.
   */
  def main(args: Array[String]): Unit = {
    
    // Read args.
    val workDirectory = args(0)
    val shufflePartitions = if (args(1).toInt > 0) args(1) else "200"

    // Initialize context.
    val jobName = JobUtility.getJobName(this)
    val sparkConf = new SparkConf().setAppName(jobName)
    val sparkContext = new SparkContext(sparkConf)
    val hiveContext = new HiveContext(sparkContext)

    // Configure job.
    hiveContext.setConf("spark.sql.shuffle.partitions", shufflePartitions)

    // // Load dependencies.
    // jobContext.loadTable(NonRevertedRevisions)
    // jobContext.loadTable(RevisionMetadata)

    // // Register SQL UDFs.
    // jobContext.udfRegistration.register("GET_DAY_NUMBER", JobUtility.getDayNumber(_: String))

    // // Create table as select.
    // jobContext.buildTable(PageContentSize, s"""
    //   |SELECT
    //   |  $RevisionMetadata.page_id AS page_id,
    //   |  GET_DAY_NUMBER($RevisionMetadata.timestamp) AS day_number,
    //   |  MAX($RevisionMetadata.text_size) AS value
    //   |FROM $RevisionMetadata
    //   |INNER JOIN $NonRevertedRevisions
    //   |ON $RevisionMetadata.revision_id = $NonRevertedRevisions.revision_id
    //   |GROUP BY $RevisionMetadata.page_id, GET_DAY_NUMBER($RevisionMetadata.timestamp)
    //   |SORT BY page_id, day_number
    // """.stripMargin)

    // // Save newly created table.
    // jobContext.saveTable(PageContentSize)  
  }
}
