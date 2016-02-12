package de.mpg.mpi.inf.d5.wiki.spark.jobs

import de.mpg.mpi.inf.d5.wiki.spark.JobContext
import de.mpg.mpi.inf.d5.wiki.spark.JobContextParquet
import de.mpg.mpi.inf.d5.wiki.spark.JobUtility
import de.mpg.mpi.inf.d5.wiki.spark.TableIds.NonRevertedRevisions
import de.mpg.mpi.inf.d5.wiki.spark.TableIds.PageContentSize
import de.mpg.mpi.inf.d5.wiki.spark.TableIds.RevisionMetadata

/**
 * BuildTablePageContentSize
 */
object BuildTablePageContentSize {
  def main(args: Array[String]): Unit = {
    // Read args.
    val wikiDirectory = args(0)
    val shufflePartitions = if (args(1).toInt > 0) args(1) else "200"

    // Initialize context, and run job.
    val jobName = JobUtility.getJobName(this)
    val jobContext = new JobContextParquet(jobName, wikiDirectory)
    jobContext.setConf("spark.sql.shuffle.partitions", shufflePartitions)
    runJob(jobContext)
  }

  def runJob(jobContext: JobContext): Unit = {
    // Load dependencies.
    jobContext.loadTable(NonRevertedRevisions)
    jobContext.loadTable(RevisionMetadata)

    // Register SQL UDFs.
    jobContext.udfRegistration.register("GET_DAY_NUMBER", JobUtility.getDayNumber(_: String))

    // Create table as select.
    jobContext.buildTable(PageContentSize, s"""
      |SELECT
      |  $RevisionMetadata.page_id AS page_id,
      |  GET_DAY_NUMBER($RevisionMetadata.timestamp) AS day_number,
      |  MAX($RevisionMetadata.text_size) AS value
      |FROM $RevisionMetadata
      |INNER JOIN $NonRevertedRevisions
      |ON $RevisionMetadata.revision_id = $NonRevertedRevisions.revision_id
      |GROUP BY $RevisionMetadata.page_id, GET_DAY_NUMBER($RevisionMetadata.timestamp)
      |SORT BY page_id, day_number
    """.stripMargin)

    // Save newly created table.
    jobContext.saveTable(PageContentSize)
  }
}
