package de.mpg.mpi.inf.d5.wiki.spark.jobs

import java.util.HashMap;

import org.apache.spark.SparkConf
import org.apache.spark.SparkContext
import org.apache.spark.sql.hive.HiveContext
import org.apache.spark.sql.SaveMode;

import de.mpg.mpi.inf.d5.wiki.spark.JobUtility

/**
 * ExportParquetToCSV
 */
object ExportParquetToCSV {
  def main(args: Array[String]): Unit = {
    // Read args.
    val parquetDirectory = args(0)
    val csvDirectory = args(1)
    val coalescePartitions = if (args(2).toInt > 0) args(2).toInt else 10

    // Init context.
    val sparkConf = new SparkConf().setAppName(JobUtility.getJobName(this))
    val sparkContext = new SparkContext(sparkConf)
    val hiveContext = new HiveContext(sparkContext)

    // Build save options map.
    val saveOptions = new HashMap[String, String]()
    saveOptions.put("header", "true")
    saveOptions.put("codec", "org.apache.hadoop.io.compress.GzipCodec")
    saveOptions.put("path", csvDirectory)

    // Load parquet data, coalesce and save as csv.
    val dataFrame = hiveContext.load(parquetDirectory)
    val dataFrameCoalesce = hiveContext.createDataFrame(dataFrame.rdd.coalesce(coalescePartitions), dataFrame.schema)
    dataFrameCoalesce.save("com.databricks.spark.csv", SaveMode.Overwrite, saveOptions)
  }
}
