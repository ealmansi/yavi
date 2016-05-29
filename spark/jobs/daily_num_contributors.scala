import org.apache.spark.sql.SQLContext

:load /home/ealmansi/dev/yavi/spark/jobs/utility.scala

def runJob(workDirectory: String, sqlContext: SQLContext): Unit = {

  loadTable("revision_metadata", workDirectory, sqlContext)

  defineTable("daily_num_contributors", s"""
    SELECT rm.page_id, rm.day_number, COUNT(DISTINCT rm.contributor_hash) AS num_contributors
    FROM revision_metadata rm
    GROUP BY rm.page_id, rm.day_number
  """, sqlContext)

  saveTable("daily_num_contributors", workDirectory, sqlContext)

}
