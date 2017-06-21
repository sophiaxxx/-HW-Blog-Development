
var App = (function (){
	function _bindevent(){
		$('#btn-addpost').on('click', _handleAddPost);
		$('#postContainer').on('click', '.taskItem .btn-delTask', _handleDelPost);
		$('#btn-login').on('click',  _Login);
		$('#btn-patchAuthor').on('click',  _handlePatAuthor);
		$('#btn-saveAuthor').on('click',  _handleSaveAuthor);
		$('#postContainer').on('click','.taskItem #btn-getPost', _renderGetPost);
		// $('#authorContainer').on('click','#btn-getAuthor', _getAuthor);

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
				console.log("login success");
				$('#authorContainer').html('');
				_getAuthor(data.username);
				// $('#authorContainer').append(`
				// 	<div class="col-md-offset-2">
				// 	<button id="btn-getAuthor" type="button" class="btn btn-link">
				// 		<h4 id="Getusername">${data.username}</h4>
				// 	</button></div>
				// 	`);
			},
			error: function (jqXHR){
				console.log(jqXHR);
			}
		});
	}

	// getLogin
	function _getLogin(){
		console.log("_getLogin");
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
		console.log(postTags);
		$.ajax({
			url: "https://richegg.top/posts",
			type: "post",
			dataType: "json",
			data: JSON.stringify({
				title: postTitle,
				content: postContent,
				tags: postTags
			}),
			success: function (data){
				$('#input-title').val('');
				$('#input-post').val('');
				$('.input-tags', taglist).remove();
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
			
			success: function (data){
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
		console.log("_getAuthor");
		// var id = $('#Getusername').text();

		$.ajax({
			url: `https://richegg.top/authors/${id}`,
			type: "get",
			dataType: "json",
			success: function (data){	

				$('#authorContainer').html('');
				$('#authorContainer').append(`
					<div class="row taskItem">
					<div>
						<label class="control-label" for="inputHelpBlock">username:</label>
                    	<label id="username" type="text" class="form-control" value="${data.username}" ></label>
		            </div>
		            <div>
						<label class="control-label" for="inputHelpBlock">name:</label>
                    	<label id="name" type="text" class="form-control" value="${data.name}"></label>
		            </div>
                    <div>
						<label class="control-label" for="inputHelpBlock">gender:</label>
	                    <label id="gender"  type="text" class="form-control" value="${data.gender}"></label>
	                </div>
	                <div>
						<label class="control-label" for="inputHelpBlock">address:</label>
	                    <label id="address"  type="text" class="form-control" value="${data.address}"></label>
	                </div>
		            </br>
		            <button id="btn-patchAuthor" class="btn btn-default" type="submit">修改</button>
					</div>
					`);
				_bindevent();
			},
			error: function (jqXHR){
				console.log(jqXHR);
			}
		});
	}

	//Patch Author
	function _handlePatAuthor(){
		console.log("patch ok");
		var data = $('#username').val();
		$.ajax({
			url: `https://richegg.top/authors/${data}`,
			type: "get",
			dataType: "json",
			success: function (data){	
				console.log(data);
				$('#authorContainer').html('');
				$('#authorContainer').append(`
					<div>
						<label id="username" class="control-label" hidden="hidden">${data.username}</label>
						<label class="control-label" for="inputHelpBlock">password</label>
                    	<input id="Password" type="text" class="form-control" value="${data.password}">
		            </div>
		            <div>
						<label class="control-label" for="inputHelpBlock">name</label>
                    	<input id="Name" type="text" class="form-control" value="${data.name}">
		            </div>
                    <div>
						<label class="control-label" for="inputHelpBlock">gender</label>
	                    <input id="Gender"  type="text" class="form-control" value="${data.gender}">
	                </div>
	                <div>
						<label class="control-label" for="inputHelpBlock">address</label>
	                    <input id="Address"  type="text" class="form-control" value="${data.address}">
	                </div>
		            </br>
		            <button id="btn-saveAuthor" class="btn btn-success" type="submit">儲存</button>
					`);
				_bindevent();
			},
			error: function (jqXHR){
				console.log(jqXHR);
			}
		});
	}

	//Save author data
	function _handleSaveAuthor(){
		console.log("ready patch");
		var UserName = $('#username').text();
		var Password = $('#Password').val();
		var Name = $('#Name').val();
		var Gender = $('#Gender').val();
		var Address = $('#Address').val();

		$.ajax({
			url: `https://richegg.top/authors/${UserName}`,
			type: 'PATCH',
			dataType: 'json',
			data: JSON.stringify({
				password: Password,
				name: Name,
				gender: Gender,
				address: Address
			}),
			success: function (data){
				console.log(data);
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
