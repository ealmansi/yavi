package de.mpg.mpi.inf.d5.wiki.spark.jobs

import org.junit.Test
import org.scalatest.junit.JUnitSuite

import de.mpg.mpi.inf.d5.wiki.spark.JobContextMock
import de.mpg.mpi.inf.d5.wiki.spark.TableIds.PageInlinks

/**
 * BuildTablePageInlinksTest
 */
class BuildTablePageInlinksTest extends JUnitSuite {
  @Test
  def testJob(): Unit = {
    // Run job on mock context.
    BuildTablePageInlinks.runJob(JobContextMock)

    // Materialize result.
    JobContextMock.getDataFrame(PageInlinks).show(1000)

    // Clear created tables.
    JobContextMock.clear()
  }
}
