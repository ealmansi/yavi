package de.mpg.mpi.inf.d5.wiki.spark.jobs

import de.mpg.mpi.inf.d5.wiki.spark.JobContext
import de.mpg.mpi.inf.d5.wiki.spark.JobContextParquet
import de.mpg.mpi.inf.d5.wiki.spark.JobUtility
import de.mpg.mpi.inf.d5.wiki.spark.TableIds.NumberOfRevertedRevisions
import de.mpg.mpi.inf.d5.wiki.spark.TableIds.RevertedRevisions
import de.mpg.mpi.inf.d5.wiki.spark.TableIds.RevisionMetadata

/**
 * BuildTableNumberOfRevertedRevisions
 */
object BuildTableNumberOfRevertedRevisions {
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
    jobContext.loadTable(RevisionMetadata)
    jobContext.loadTable(RevertedRevisions)

    // Register SQL UDFs.
    jobContext.udfRegistration.register("GET_DAY_NUMBER", JobUtility.getDayNumber(_: String))

    // Create table as select.
    jobContext.buildTable(NumberOfRevertedRevisions, s"""
      |SELECT
      |  $RevisionMetadata.page_id AS page_id,
      |  GET_DAY_NUMBER($RevisionMetadata.timestamp) AS day_number,
      |  COUNT(*) AS value
      |FROM $RevisionMetadata
      |INNER JOIN $RevertedRevisions
      |ON $RevisionMetadata.revision_id = $RevertedRevisions.revision_id
      |GROUP BY $RevisionMetadata.page_id, GET_DAY_NUMBER($RevisionMetadata.timestamp)
      |SORT BY page_id, day_number
    """.stripMargin)

    // Save newly created table.
    jobContext.saveTable(NumberOfRevertedRevisions)
  }
}
