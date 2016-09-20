import org.apache.spark.sql.SQLContext

:load /home/ealmansi/dev/yavi/spark/jobs/utility.scala

def runJob(workDirectory: String, sqlContext: SQLContext): Unit = {

  loadTable("revision_metadata", workDirectory, sqlContext)

  defineTable("daily_num_revisions", s"""
    SELECT rm.page_id, rm.day_number, COUNT(*) AS num_revisions
    FROM revision_metadata rm
    GROUP BY rm.page_id, rm.day_number
  """, sqlContext)

  saveTable("daily_num_revisions", workDirectory, sqlContext)

}
