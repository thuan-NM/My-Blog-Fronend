import React, { useEffect, useState } from "react";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const DeniedJob = () => {
    const [posts, setPosts] = useState([]);
    const storedToken = localStorage.getItem('token');
    const decodedToken = jwtDecode(storedToken);
    const [isLoading, setIsLoading] = useState(true);

    const data = {
        userId: decodedToken.userId,
        statusdata: "Denied"
    }

    useEffect(() => {
        fetchPosts();
    }, [posts]);

    const fetchPosts = async () => {
        try {
            const jobstatusResponse = await axios.get(`http://localhost:3001/jobstatus/applied`, { params: data });
            setPosts(jobstatusResponse.data.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error :', error);
        }
    };

    const handleDelete = async (postId) => {
        try {
            await axios.delete(`http://localhost:3001/jobstatus/${postId}`, {
                headers: {
                    Authorization: `Bearer ${storedToken}`,
                },
            });
            fetchPosts(); // Refetch the posts after a post is deleted
        } catch (error) {
            console.error('Error deleting job status:', error);
        }
    };

    if (isLoading) {
        <div className="spinner animate__animated animate__fast animate__fadeIn">
            <div className="bounce1"></div>
            <div className="bounce2"></div>
            <div className="bounce3"></div>
        </div>
    }
    if (posts.length == 0) {
        return (
            <div className="animate__animated animate__fast animate__fadeIn">
                <h1 className="nobody">
                    Không có bất cứ gì!
                </h1>
                <div className="spinner">
                    <div className="bounce1"></div>
                    <div className="bounce2"></div>
                    <div className="bounce3"></div>
                </div>
            </div>
        )
    }
    return (
        <div className="tab-pane fade show active animate__animated animate__fast animate__fadeIn" id="applied" role="tabpanel" aria-labelledby="applied-tab">
            {posts.map((post, index) => (
                <div className="post-bar" key={index}>
                    <div className="p-all saved-post">
                        <div className="usy-dt">
                            <div className="wordpressdevlp">
                                <h2>{post.title}</h2>
                                <p><i className="la la-clock-o"></i>Đăng vào {new Date(post.createdAt).toLocaleString()} bởi {post.author.userdata.firstName} {post.author.userdata.lastName}</p>
                            </div>
                        </div>
                    </div>
                    <ul className="savedjob-info saved-info">
                        <li>
                            <h3>Applicants</h3>
                            <p>10</p>
                        </li>
                        <li>
                            <h3>Job Type</h3>
                            <p>{post.typeOfJob}</p>
                        </li>
                        <li>
                            <h3>Salary</h3>
                            <p>{post.price}/hr</p>
                        </li>
                        <div className="devepbtn saved-btn ">
                            <button className="clrbtn" disabled>Denied</button>
                            <button className="clrbtn" onClick={() => handleDelete(post.status._id)}>
                                <i className="far fa-trash-alt"></i>
                            </button>
                        </div>
                    </ul>
                </div>
            ))}
        </div>
    )
}

export default DeniedJob;
