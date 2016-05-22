import org.apache.spark.sql.SQLContext

:load jobs/job_utility.scala

def runJob(workDirectory: String, sqlContext: SQLContext): Unit = {

  loadTable("page_metadata", workDirectory, sqlContext)

  defineTable("redirect_map", s"""
      select pm1.page_id as page_id, coalesce(pm3.page_id, pm2.page_id, pm1.page_id) as redirect
      from page_metadata pm1
      left join page_metadata pm2
      on pm1.redirect is not null and pm1.redirect = pm2.title
      left join page_metadata pm3
      on pm2.redirect is not null and pm2.redirect = pm3.title
  """, sqlContext)

  saveTable("redirect_map", workDirectory, sqlContext)

}
