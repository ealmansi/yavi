package de.mpg.mpi.inf.d5.wiki.spark.jobs

import de.mpg.mpi.inf.d5.wiki.spark.JobContext
import de.mpg.mpi.inf.d5.wiki.spark.JobContextParquet
import de.mpg.mpi.inf.d5.wiki.spark.JobUtility
import de.mpg.mpi.inf.d5.wiki.spark.TableIds.PageMetadata
import de.mpg.mpi.inf.d5.wiki.spark.TableIds.TitleToPageId

/**
 * BuildTableTitleToPageId
 */
object BuildTableTitleToPageId {
  def main(args: Array[String]): Unit = {
    // Read args.
    val wikiDirectory = args(0)
    val shufflePartitions = if (args(1).toInt > 0) args(1) else "200"

    // Initialize context and create table.
    val jobName = JobUtility.getJobName(this)
    val jobContext = new JobContextParquet(jobName, wikiDirectory)
    jobContext.setConf("spark.sql.shuffle.partitions", shufflePartitions)
    runJob(jobContext)
  }

  def runJob(jobContext: JobContext): Unit = {
    // Load dependencies.
    jobContext.loadTable(PageMetadata)

    // Create table as select.
    jobContext.buildTable(TitleToPageId, s"""
      |SELECT
      |  $PageMetadata.title AS title,
      |  $PageMetadata.page_id AS page_id
      |FROM $PageMetadata
      |SORT BY title
    """.stripMargin)

    // Save newly created table.
    jobContext.saveTable(TitleToPageId)
  }
}
