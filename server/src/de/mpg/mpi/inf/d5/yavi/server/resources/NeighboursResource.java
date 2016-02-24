package de.mpg.mpi.inf.d5.yavi.server.resources;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

import org.glassfish.jersey.server.JSONP;

import de.mpg.mpi.inf.d5.yavi.server.RelatedPages;
import de.mpg.mpi.inf.d5.yavi.server.util.DateUtil;

@Path("/neighbours")
@Produces("application/x-javascript")
public class NeighboursResource {

  @GET
  @JSONP(queryParam = JSONP.DEFAULT_CALLBACK)
  public List<Integer> doGet(@QueryParam("pageid") int pageId,
      @QueryParam("wikipediaid") String wikipediaId,
      @QueryParam("datefrom") String dateFrom,
      @QueryParam("dateto") String dateTo) {
    int dayFrom = DateUtil.dateToDayNumber(dateFrom);
    int dayTo = DateUtil.dateToDayNumber(dateTo);
    if (pageId > 0 &&
        ResourceUtil.isValidWikipediaId(wikipediaId) &&
        ResourceUtil.isValidPeriod(dayFrom, dayTo)) {
      Set<Integer> neighbours =
          RelatedPages.getRelatedPages(pageId, wikipediaId, dayFrom, dayTo);
      if (neighbours != null) {
        return new ArrayList<>(neighbours);
      }
    }
    throw new WebApplicationException(Response.Status.BAD_REQUEST);
  }
}
