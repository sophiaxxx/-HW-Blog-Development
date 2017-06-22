
var App = (function (){
	function _bindevent(){
		$('#CreatPostContainer').on('click', '#btn-addpost', _handleAddPost);
		$('#postContainer').on('click', '.taskItem .btn-delTask', _handleDelPost);
		$('#btn-login').on('click',  _Login);
		$('#authorContainer').on('click', '#btn-patchAuthor',  _handlePatAuthor);
		$('#authorContainer').on('click', '#btn-saveAuthor', _handleSaveAuthor);
		$('#postContainer').on('click','.taskItem #btn-getPost', _renderGetPost);
		$('#postContainer').on('click','.taskItem #btn-patchPost', _handlePatPost);
		$('#CreatPostContainer').on('click', '#btn-updatePost', _handleSavePost);


	}
	

	// Login
	function _Login(){
		var user = $('#user').val();
		var password = $('#password').val();
		$.ajax({
			url: "https://richegg.top/login",
			type: "post",
			dataType: "json",
			xhrFields: {
		         withCredentials: true
		    },
			data: JSON.stringify({
				username: 'test1',
				password: 'test123'
			}),
			success: function (data){
				$('#authorContainer').html('');
				_getAuthor(data.username);
			},
			error: function (jqXHR){
				console.log(jqXHR);
			}
		});
	}

	// getLogin
	function _getLogin(){
		$.ajax({
			url: "https://richegg.top/login",
			type: "get",
			dataType: "json",
			xhrFields: {
		         withCredentials: true
		    },
			
			success: function (data){
				console.log("OK");
			},
			error: function (jqXHR){
				console.log(jqXHR);
			}
		});
	}

	// Add post
	function _handleAddPost(){
		
		var postTitle = $('#input-title').val();
		var postContent = $('#input-post').val();
		var taglist = $('#input-tags').val();
		var postTags = taglist.split(',');
		$.ajax({
			url: "https://richegg.top/posts",
			type: "post",
			dataType: "json",
			data: JSON.stringify({
				title: postTitle,
				content: postContent,
				tags: postTags
			}),
			xhrFields: {
		         withCredentials: true
		    },
			success: function (data){
				$('#input-title').val('');
				$('#input-post').val('');
				$('#input-tags').attr('value', '');
				$('.inputTags-item').remove();
				_renderTODOs();
			},
			error: function (jqXHR){
				console.log(jqXHR);
			}
		});
		
	}

	// Delete post
	function _handleDelPost(){
		var id = $(this).parents('.taskItem').attr('data-id');
		$.ajax({
			url: `https://richegg.top/posts/${id}`,
			type: 'DELETE',
			dataType: 'json',
			xhrFields: {
		         withCredentials: true
		    },
			success: function (data){
				_renderTODOs();
			},
			error: function (jqXHR){
				console.log(jqXHR);
			}
		});
	}

	//Patch post
	function _handlePatPost(){
		var id = $(this).parents('.taskItem').attr('data-id');
		$.ajax({
			url: `https://richegg.top/posts/${id}`,
			type: "get",
			dataType: "json",
			success: function (data){
				$('#input-id').val(data.id);
				$('#input-title').val(data.title);
				$('#input-post').val(data.content);
				$('.inputTags-list').remove();
				$('#input-tags').inputTags({
					tags: data.tags
				});
				$('#btn-updatePost').show();
				$('#btn-addpost').hide();
				$('body').scrollTop(0);
			},
			error: function (jqXHR){
				console.log(jqXHR);
			}
		});
	}

	//Save Patchpost
	function _handleSavePost(){
		console.log("ready patch");
		var id = $('#input-id').val();
		var Title = $('#input-title').val();
		var Content = $('#input-post').val();
		var taglist = $('#input-tags').val();
		var postTags = taglist.split(',');
		console.log(id);

		$.ajax({
			url: `https://richegg.top/posts/${id}`,
			type: 'PATCH',
			dataType: 'json',
			data: JSON.stringify({
				title: Title,
				content: Content,
				tags: postTags
			}),
			xhrFields: {
		         withCredentials: true
		    },
			success: function (data){
			console.log("patch OKKKK");
				$('#btn-updatePost').hide();
				$('#btn-addpost').show();
				$('#input-title').val('');
				$('#input-post').val('');
				$('#input-tags').attr('value', '');
				$('.inputTags-list').remove();
				$('#input-tags').inputTags();
				
				_renderTODOs();
			},
			error: function (jqXHR){
				console.log(jqXHR);
			}
		});
	}

	// Get postList
	function _renderTODOs(){
		$.ajax({
			url: "https://richegg.top/posts",
			type: "get",
			dataType: "json",
			success: function (data){
				
				$('#postContainer').html('');
				data.reverse();
				for(let postlist of data){

					var time  = moment(postlist.created_at).format('LLLL');
					
					var tag = "";

					for(let tags of postlist.tags){
						tag += `<a href="#">${tags} </a>`;
					}
					
					$('#postContainer').append(`
						<div class="row taskItem" data-id="${postlist.id}">
							<div class="row">
								<h2>${postlist.title}</h2>
								<button type="button" class="close btn-delTask" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button> 
							</div>
		                    
		                    <div class="row">
		                        <div class="group1 col-sm-5 col-md-5">
		                            <span id="author" class="glyphicon glyphicon-user" >
		                            ${postlist.author.name}</span>
		                        </div>
		                        
		                        <div class="group2 col-sm-5 col-md-5">
		                            <span id="created_at" class="glyphicon glyphicon-time" >
		                                <small>${time}</small>
		                            </span> 
		                        </div>
		                        <div class="group3 col-sm-2 col-md-2">
		                        <button id="btn-patchPost" type="button" class="btn btn-link">
									<span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>
									修改文章
								</button>
		                        </div>

		                    </div>    
		                    <hr> 
		                    <div class="row">       
		                    	<p id="content">${postlist.content}</p>
		                    </div>
		                    <div class="row pull-right">  
		                    	<button id="btn-getPost" type="button" class="btn btn-link" 
		                    		data-toggle="modal" data-target="#postModal"><p>閱讀更多...</p></button>
		                    </div> 
		                    <div class="row"> 
	                             <span id="tag" class="glyphicon glyphicon-bookmark">
	                             ${tag}
	                             </span>
		                    </div> 
		                    <hr>   
    
		                </div>
						`);
				}
			},
			error: function (jqXHR){
				console.log(jqXHR);
			}
		});
	}

	// Get post
	function _renderGetPost(){
		var id = $(this).parents('.taskItem').attr('data-id');
		$.ajax({
			url: `https://richegg.top/posts/${id}`,
			type: "get",
			dataType: "json",
			success: function (data){
				$('.mtitle').text(data.title);
				$('.mcontent').text(data.content);
				$('#postModal').on('shown.bs.modal', function () {
				})
			},
			error: function (jqXHR){
				console.log(jqXHR);
			}
		});
	}

	// Get author data
	function _getAuthor(id){
		$.ajax({
			url: `https://richegg.top/authors/${id}`,
			type: "get",
			dataType: "json",
			xhrFields: {
				withCredentials: true
			},
			success: function (data){	
				$('#authorContainer').html('');
				$('#authorContainer').append(`
					<div class="row taskItem">
					<div>
						<label class="control-label" for="inputHelpBlock">username:</label>
						<label id="username" class="control-label" for="inputHelpBlock">${data.username}</label>
		            </div>
		            <div>
						<label class="control-label" for="inputHelpBlock">name:</label>
						<label id="name" class="control-label" for="inputHelpBlock">${data.name}</label>
		            </div>
                    <div>
						<label class="control-label" for="inputHelpBlock">gender:</label>
						<label id="gender" class="control-label" for="inputHelpBlock">${data.gender}</label>
	                </div>
	                <div>
						<label class="control-label" for="inputHelpBlock">address:</label>
						<label id="address"  class="control-label" for="inputHelpBlock">${data.address}</label>
	                </div>
		            </br>
		            <button id="btn-patchAuthor" class="btn btn-default" type="submit">修改</button>
					</div>
					`);
			},
			error: function (jqXHR){
				console.log(jqXHR);
			}
		});
	}

	//Patch Author
	function _handlePatAuthor(){
		var userid = $('#username').text();
		$.ajax({
			url: `https://richegg.top/authors/${userid}`,
			type: "get",
			dataType: "json",
			xhrFields: {
		         withCredentials: true
		    },
			success: function (data){	
				$('#authorContainer').html('');
				$('#authorContainer').append(`
					<div>
						<label class="control-label" for="inputHelpBlock">username</label>
                    	<input id="Username" type="text" class="form-control" value="${data.username}">
		            </div>
		            <div>
						<label class="control-label" for="inputHelpBlock">name</label>
                    	<input id="Name" type="text" class="form-control" value="${data.name}">
		            </div>
                    <div>
						<label class="control-label" for="inputHelpBlock">gender</label>
						<div>
		                    <select class="selectpicker">
			                    <option value="F">F</option>
			                    <option value="M">M</option>
			                    <option value="O">O</option>
		                    </select>
	                	</div>
	                </div>
	                <div>
						<label class="control-label" for="inputHelpBlock">address</label>
	                    <input id="Address"  type="text" class="form-control" value="${data.address}">
	                </div>
		            </br>
		            <button id="btn-saveAuthor" class="btn btn-success" type="submit">儲存</button>
					`);
				$('.selectpicker').val(data.gender);
				$('.selectpicker').change();


			},
			error: function (jqXHR){
				console.log(jqXHR);
			}
		});
	}

	//Save author data
	function _handleSaveAuthor(){
		var UserName = $('#Username').val();
		var Name = $('#Name').val();
		var Gender = $('.selectpicker').val();
		var Address = $('#Address').val();

		$.ajax({
			url: `https://richegg.top/authors/${UserName}`,
			type: 'PATCH',
			dataType: 'json',
			data: JSON.stringify({
				username: UserName,
				name: Name,
				gender: Gender,
				address: Address
			}),
			xhrFields: {
		         withCredentials: true
		    },
			success: function (data){
				_renderTODOs();
				_getAuthor(data.username);
			},
			error: function (jqXHR){
				console.log(jqXHR);
			}
		});
	}	

	function init(){
		_bindevent();
		_renderTODOs();
	}

	return {init}

})();
