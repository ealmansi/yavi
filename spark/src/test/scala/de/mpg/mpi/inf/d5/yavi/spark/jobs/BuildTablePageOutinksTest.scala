package de.mpg.mpi.inf.d5.wiki.spark.jobs

import org.junit.Test
import org.scalatest.junit.JUnitSuite

import de.mpg.mpi.inf.d5.wiki.spark.JobContextMock
import de.mpg.mpi.inf.d5.wiki.spark.TableIds.PageOutlinks

/**
 * BuildTablePageOutlinksTest
 */
class BuildTablePageOutlinksTest extends JUnitSuite {
  @Test
  def testJob(): Unit = {
    // Run job on mock context.
    BuildTablePageOutlinks.runJob(JobContextMock)

    // Materialize result.
    JobContextMock.getDataFrame(PageOutlinks).show(1000)

    // Clear created tables.
    JobContextMock.clear()
  }
}
