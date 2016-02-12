package de.mpg.mpi.inf.d5.wiki.spark.jobs

import org.apache.spark.SparkConf
import org.apache.spark.SparkContext
import org.apache.spark.sql.hive.HiveContext

import de.mpg.mpi.inf.d5.wiki.spark.JobUtility

/**
 * ExportAvroToParquet
 */
object ExportAvroToParquet {
  def main(args: Array[String]): Unit = {
    // Read args.
    val avroDirectory = args(0)
    val parquetDirectory = args(1)

    // Init context.
    val sparkConf = new SparkConf().setAppName(JobUtility.getJobName(this))
    val sparkContext = new SparkContext(sparkConf)
    val hiveContext = new HiveContext(sparkContext)

    // Load avro data and save as parquet.
    val dataFrame = hiveContext.load(avroDirectory, "com.databricks.spark.avro")
    dataFrame.save(parquetDirectory, "parquet")
  }
}
