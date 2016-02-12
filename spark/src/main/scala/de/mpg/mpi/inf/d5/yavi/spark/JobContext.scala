package de.mpg.mpi.inf.d5.wiki.spark

import org.apache.spark.SparkConf
import org.apache.spark.SparkContext
import org.apache.spark.sql.UDFRegistration
import org.apache.spark.sql.hive.HiveContext

/**
 * JobContext
 */
trait JobContext {
  /**
   *
   */
  def sparkConf: SparkConf
  def sparkContext: SparkContext
  def hiveContext: HiveContext

  /**
   *
   */
  def loadTable(tableId: String): Unit

  /**
   *
   */
  def buildTable(tableId: String, sqlQuery: String): Unit = {
    val dataFrame = hiveContext.sql(sqlQuery)
    dataFrame.explain
    dataFrame.registerTempTable(tableId)
  }

  /**
   *
   */
  def saveTable(tableId: String): Unit

  /**
   *
   */
  def setConf(property: String, value: String): Unit = {
    hiveContext.setConf(property, value)
  }

  /**
   *
   */
  def udfRegistration: UDFRegistration = {
    hiveContext.udf
  }
}
