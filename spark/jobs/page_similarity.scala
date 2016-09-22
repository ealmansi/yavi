import org.apache.spark.sql.SQLContext

:load /home/ealmansi/dev/yavi/spark/jobs/utility.scala

def runJob(workDirectory: String, sqlContext: SQLContext): Unit = {

  loadTable("page_outlinks", workDirectory, sqlContext)

  defineTable("neighbourhood_size", s"""
    SELECT po.page_id, COUNT(*) AS size
    FROM page_outlinks po
    GROUP BY po.page_id
  """, sqlContext)

  defineTable("neighbourhood_intersection_size", s"""
    SELECT po1.page_id AS page_id_1, po2.page_id AS page_id_2, COUNT(*) AS size
    FROM page_outlinks po1
    INNER JOIN page_outlinks po2 ON po1.outlink = po2.outlink
    WHERE po1.page_id < po2.page_id
    GROUP BY po1.page_id, po2.page_id
  """, sqlContext)

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
