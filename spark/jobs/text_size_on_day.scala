import org.apache.spark.sql.SQLContext

:load /home/ealmansi/dev/yavi/spark/jobs/utility.scala

def runJob(workDirectory: String, sqlContext: SQLContext): Unit = {

  loadTable("revision_metadata", workDirectory, sqlContext)

  defineTable("text_size_on_day", s"""
    SELECT rm.page_id, rm.day_number, percentile(rm.text_size, 0.5)
    FROM revision_metadata rm
    GROUP BY rm.page_id, rm.day_number
  """, sqlContext)

  saveTable("text_size_on_day", workDirectory, sqlContext)

}

