package de.mpg.mpi.inf.d5.wiki.spark.jobs

import de.mpg.mpi.inf.d5.wiki.spark.JobUtility
import org.apache.spark.SparkConf
import org.apache.spark.SparkContext
import org.apache.spark.sql.hive.HiveContext
import org.apache.spark.sql.SaveMode

/**
 * BuildTablePageWikilinks
 */
object BuildTablePageWikilinks {

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

    // Register SQL UDFs.
    hiveContext.udf.register("normalize_wikilink", JobUtility.normalizeWikilink(_: String))

    // Load dependencies.
    val revisionWikilinks = hiveContext.load(s"$workDirectory/avro/revision_wikilinks", "com.databricks.spark.avro")
    revisionWikilinks.registerTempTable("revision_wikilinks")

    // Build table.
    val pageWikilinks = hiveContext.sql(s"""
        select distinct rw.page_id, normalize_wikilink(rw.wikilink) as wikilink
        from revision_wikilinks rw
        where normalize_wikilink(rw.wikilink) <> ''
    """)
    pageWikilinks.save(s"$workDirectory/avro/page_wikilinks",
                    "com.databricks.spark.avro",
                    SaveMode.Overwrite)
  }
}
