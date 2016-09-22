import org.apache.spark.sql.SQLContext

:load /home/ealmansi/dev/yavi/spark/jobs/utility.scala

def runJob(workDirectory: String, sqlContext: SQLContext): Unit = {

  loadTable("page_outlinks", workDirectory, sqlContext)

  defineTable("neighbourhood_size", s"""
    SELECT po.page_id, COUNT(*) AS size
    FROM page_outlinks po
    GROUP BY po.page_id
  """, sqlContext)

  saveTable("neighbourhood_size", workDirectory, sqlContext)

}
