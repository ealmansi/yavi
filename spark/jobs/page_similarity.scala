import org.apache.spark.sql.SQLContext

:load /home/ealmansi/dev/yavi/spark/jobs/utility.scala

def runJob(workDirectory: String, sqlContext: SQLContext): Unit = {

  loadTable("neighbourhood_size", workDirectory, sqlContext)
  loadTable("neighbourhood_intersection_size", workDirectory, sqlContext)

  defineTable("page_similarity", s"""
    SELECT
      ns1.page_id AS page_id_1,
      ns2.page_id AS page_id_2,
      nis.size / (ns1.size + ns2.size - nis.size) AS score
    FROM neighbourhood_intersection_size nis
    INNER JOIN neighbourhood_size ns1 ON nis.page_id_1 = ns1.page_id
    INNER JOIN neighbourhood_size ns2 ON nis.page_id_2 = ns2.page_id
    WHERE 10 * nis.size > (ns1.size + ns2.size - nis.size)
  """, sqlContext)

  saveTable("page_similarity", workDirectory, sqlContext)

}
