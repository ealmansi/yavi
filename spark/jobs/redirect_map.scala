import org.apache.spark.sql.SQLContext

:load /home/ealmansi/dev/yavi/spark/jobs/utility.scala

def runJob(workDirectory: String, sqlContext: SQLContext): Unit = {

  loadTable("page_metadata", workDirectory, sqlContext)

  defineTable("redirect_map", s"""
      SELECT pm1.page_id AS page_id, COALESCE(pm2.page_id, pm1.page_id) AS redirect
      FROM page_metadata pm1
      LEFT JOIN page_metadata pm2
      ON pm1.page_id <> pm2.page_id AND pm1.redirect = pm2.title
  """, sqlContext)

  saveTable("redirect_map", workDirectory, sqlContext)

}
