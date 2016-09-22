import org.apache.spark.sql.SQLContext

:load /home/ealmansi/dev/yavi/spark/jobs/utility.scala

def runJob(workDirectory: String, sqlContext: SQLContext): Unit = {

  loadTable("page_outlinks", workDirectory, sqlContext)

  defineTable("neighbourhood_intersection_size", s"""
    SELECT po1.page_id AS page_id_1, po2.page_id AS page_id_2, COUNT(*) AS size
    FROM page_outlinks po1
    INNER JOIN page_outlinks po2 ON po1.outlink = po2.outlink
    WHERE po1.page_id < po2.page_id
    GROUP BY po1.page_id, po2.page_id
  """, sqlContext)

  saveTable("neighbourhood_intersection_size", workDirectory, sqlContext)

}
