package de.mpg.mpi.inf.d5.wiki.spark.jobs

import de.mpg.mpi.inf.d5.wiki.spark.JobContext
import de.mpg.mpi.inf.d5.wiki.spark.JobContextParquet
import de.mpg.mpi.inf.d5.wiki.spark.JobUtility
import de.mpg.mpi.inf.d5.wiki.spark.TableIds.NonRevertedRevisions
import de.mpg.mpi.inf.d5.wiki.spark.TableIds.RevertedRevisions
import de.mpg.mpi.inf.d5.wiki.spark.TableIds.RevisionMetadata

/**
 * BuildTableNonRevertedRevisions
 */
object BuildTableNonRevertedRevisions {
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
    jobContext.loadTable(RevisionMetadata)
    jobContext.loadTable(RevertedRevisions)

    // Create table as select.
    jobContext.buildTable(NonRevertedRevisions, s"""
      |SELECT
      |  $RevisionMetadata.revision_id AS revision_id
      |FROM $RevisionMetadata
      |LEFT JOIN $RevertedRevisions
      |ON $RevisionMetadata.revision_id = $RevertedRevisions.revision_id
      |WHERE $RevertedRevisions.revision_id IS NULL
      |SORT BY revision_id
    """.stripMargin)

    // Save newly created table.
    jobContext.saveTable(NonRevertedRevisions)
  }
}
