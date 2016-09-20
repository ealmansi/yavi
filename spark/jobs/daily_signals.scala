import org.apache.spark.sql.SQLContext

:load /home/ealmansi/dev/yavi/spark/jobs/utility.scala

def runJob(workDirectory: String, sqlContext: SQLContext): Unit = {

  loadTable("revision_metadata", workDirectory, sqlContext)

  defineTable("daily_signals", s"""
    SELECT
      rm.page_id,
      rm.day_number,
      COUNT(*) AS num_revisions,
      COUNT(DISTINCT rm.contributor_hash) AS num_contributors,
      CAST(ROUND(percentile(rm.text_size, 0.5)) AS BIGINT) AS text_size
    FROM revision_metadata rm
    GROUP BY rm.page_id, rm.day_number
  """, sqlContext)

  saveTable("daily_signals", workDirectory, sqlContext)

}
