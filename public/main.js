$("#scrape-btn").click(function() {
  console.log("scrape!");
  $.ajax("/api/scrape", {
    type: "get"
  }).then(function(data) {
    location.reload();
  });
});
