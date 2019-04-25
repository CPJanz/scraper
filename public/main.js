$("#scrape-btn").click(function() {
  console.log("scrape!");
  $.ajax("/api/scrape", {
    type: "get"
  }).then(function(data) {
    console.log(data);
    location.reload();
  });
});

$(".add-comment-btn").click(function() {
  console.log("Add Comment");
  $.ajax("/api/addNote", {
    type: "post",
    data: {
      text: $($(this).data("text-id")).val(),
      articleId: $(this).data("article-id")
    }
  }).then(function(data) {
    console.log(data);
    location.reload();
  });
});

$(".delete-comment-btn").click(function() {
  console.log("Delete Comment");
  $.ajax("/api/deleteNote", {
    type: "delete",
    data: {
      id: $(this).data("id"),
      articleId: $(this).data("article-id")
    }
  }).then(function(data) {
    console.log(data);
    location.reload();
  });
});

$("#delete-all-articles-btn").click(function() {
  console.log("Delete Comment");
  $.ajax("/api/deleteAll", {
    type: "delete"
  }).then(function(data) {
    console.log(data);
    location.reload();
  });
});
