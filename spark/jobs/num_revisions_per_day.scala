import org.apache.spark.sql.SQLContext

:load /home/ealmansi/dev/yavi/spark/jobs/utility.scala

def runJob(workDirectory: String, sqlContext: SQLContext): Unit = {

  loadTable("revision_metadata", workDirectory, sqlContext)

  defineTable("num_revisions_per_day", s"""
    SELECT rm.page_id, rm.day_number, COUNT(*)
    FROM revision_metadata rm
    GROUP BY rm.page_id, rm.day_number
  """, sqlContext)

  saveTable("num_revisions_per_day", workDirectory, sqlContext)

}
