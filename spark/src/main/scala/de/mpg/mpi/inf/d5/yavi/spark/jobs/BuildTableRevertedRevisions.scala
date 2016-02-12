package de.mpg.mpi.inf.d5.wiki.spark.jobs

import de.mpg.mpi.inf.d5.wiki.spark.JobContext
import de.mpg.mpi.inf.d5.wiki.spark.JobContextParquet
import de.mpg.mpi.inf.d5.wiki.spark.JobUtility
import de.mpg.mpi.inf.d5.wiki.spark.TableIds.RevertedRevisions
import de.mpg.mpi.inf.d5.wiki.spark.TableIds.RevisionMetadata

/**
 * BuildTableRevertedRevisions
 */
object BuildTableRevertedRevisions {
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

    // Create table as select.
    jobContext.buildTable(RevertedRevisions, s"""
      |SELECT
      |  RevisionMetadataP.revision_id AS revision_id
      |FROM $RevisionMetadata RevisionMetadata
      |INNER JOIN $RevisionMetadata RevisionMetadataP
      |ON RevisionMetadata.parent_id = RevisionMetadataP.revision_id
      |INNER JOIN $RevisionMetadata RevisionMetadataG
      |ON RevisionMetadataP.parent_id = RevisionMetadataG.revision_id
      |WHERE
      |  RevisionMetadata.sha1 = RevisionMetadataG.sha1 AND
      |  RevisionMetadataP.sha1 <> RevisionMetadataG.sha1
      |SORT BY revision_id
    """.stripMargin)

    // Save newly created table.
    jobContext.saveTable(RevertedRevisions)
  }
}
