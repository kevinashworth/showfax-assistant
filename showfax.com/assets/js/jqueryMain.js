$(document).ready(function(){
	
	$("#modalLoginForm").submit(function(e){
		e.preventDefault();
		var $nextURL = $("#nextURL",this).val()

		$.ajax({
			type: "POST",
			url: '/service.cfm?method=loggingService',
			data:{
				username:$("#signin-input-user",this).val(),
				password:$("#signin-input-pass",this).val()
			},
			success: function(objResponse){
				if(objResponse.status == "failed"){
					$("#signinModal #loginResultMsg").addClass("modal-danger").empty().append(objResponse.messages[0]);
					return false;
				}
				window.location.href = $nextURL;
			},
			error: function(ErrorMsg) {
				console.warn( ErrorMsg );
				return false;
			}
		});

		return false;
	});

});